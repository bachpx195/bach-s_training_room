window.onload = async function() {
  var $form = $(SELECTOR.mergeForm);

  // $(SELECTOR.markdownContainer).prepend(MB.templateButton);
  $(MB.templateHTML).insertBefore(SELECTOR.markdownInput);
  console.log("bach da o day")
  console.log("bach da o day")

  MB.compareBrachKey = getCompareBranchKey();
  MB.mergeRequestId = getMergeRequestId();
  await restoreTemplateData();

  $(SELECTOR.showTemplateButton).on("click", function() {
    $form.toggleClass("show-template");
    $form.find(SELECTOR.templateDropdown).toggleClass("d-none");

    MB.isShowTemplate = $form.hasClass("show-template");
    var tabTitle = MB.isShowTemplate ? "Template" : "Write";

    $(SELECTOR.markdownWriteButton).html(tabTitle).click();
    setDefaultTemplateValues();
    updateMarkdownContent();
  });

  if (MB.isShowTemplate) {
    $(SELECTOR.showTemplateButton).trigger("click");
  }

  $form.addClass("show");
};

$(SELECTOR.markdownInput).on("change input", function() {
  var links = $(this).val().match(LINK_REGEX);
  if (_.isEmpty(links)) return;

  var $formModel = $(MB.lastFocusField);
  var newLink = _.chain(links).difference(MB.template.links).head().value();
  if (!newLink || !$formModel.length) return;

  $formModel.focus();
  $formModel.val(`${$formModel.val()}${newLink}`);

  if (MB.isShowTemplate) $formModel.trigger("change");
  MB.template.links.push(newLink);

  document.execCommand("selectAll", false, null);
  document.getSelection().collapseToEnd();
});

$(document).on("keyup change input", ".form-model", function() {
  formatTemplateValue(this);
  updateMarkdownContent();
  storeTemplateData();
});

$(document).on("click", ".btn-add-more", function() {
  var $btn = $(this);
  var $container = $btn.closest(".group-container");
  var $targetClone = $container.find(".group-item").first().clone();

  $targetClone.find(".form-model").val("");
  $targetClone.insertBefore($btn).find(".form-model").trigger("focus");
  reIndexFormGroup($container);
});

$(document).on("click", ".btn-delete", function() {
  var $groupItem = $(this).closest(".group-item");
  var $container = $groupItem.closest(".group-container");
  var $formModel = $groupItem.find(".form-model");

  if ($container.find(".form-model").length == 1) {
    $formModel.val("").trigger("change");
  } else {
    $groupItem.remove();
    reIndexFormGroup($container);
  }

  formatTemplateValue($formModel);
  updateMarkdownContent();
  storeTemplateData();
});

$(document).on("change", "[model='hasConsiderOldVersion']", function() {
  var isDisabled = MB.template.hasConsiderOldVersion == "KHÔNG CẦN";
  var $model = getModelElement("considerContent");

  if (isDisabled) $model.val("").trigger("change");
  $model.closest(".form-group").toggleClass("d-none", isDisabled);
});

$(document).on("change input focus", "textarea.form-model", function() {
  var $model = $(this);

  if (!$model.val()) return $model.removeAttr("style");
  $model.height(0).height(this.scrollHeight - 13 + "px");
});

$(document).on("focus blur", ".form-model", function() {
  MB.lastFocusField = $(this);
});

function updateMarkdownContent() {
  var templateMarkdown = buildTemplateMarkdown();

  MB.template.links = templateMarkdown.match(LINK_REGEX);
  $(SELECTOR.markdownInput).val(templateMarkdown);

  detectCompletedSection();
}

function buildTemplateMarkdown() {
  var templateSections = detectInputtedSections();
  var templateText = _.chain(MB).pick(templateSections).values().join("\n").value();

  _.forEach(MB.template, function(value, key) {
    templateText = replaceTemplateValue(templateText, key, value)
  });

  return _.replace(templateText, RegExp("( *\n){3,}", "g"), "\n\n");
}

function setDefaultTemplateValues() {
  MB.template.ticket = MB.template.ticket || $(SELECTOR.mergeTitle).val() || "";
  _.forEach(MB.template, setDefaultModelValue);
}

async function restoreTemplateData() {
  var storedSetting = await chrome.storage.local.get("isShowTemplate");
  var storedTemplate = await getStoredTemplateData();

  MB.template = storedTemplate || MB.template;
  MB.isShowTemplate = _.get(storedSetting, "isShowTemplate", true);
}

async function getStoredTemplateData() {
  var storedData = await chrome.storage.local.get();
  return storedData[MB.mergeRequestId] || storedData[MB.compareBrachKey];
}

function storeTemplateData() {
  var storeKey = MB.mergeRequestId || MB.compareBrachKey;
  chrome.storage.local.set({[storeKey]: MB.template, isShowTemplate: MB.isShowTemplate});
}

function getCompareBranchKey() {
  var $branchCodes = $(SELECTOR.branchCode);

  var branches = _.map($branchCodes, function(elem) {
    return _.trim($(elem).text());
  });

  if (branches.length == 2) {
    return `${_.head(branches)}@${_.last(branches)}`;
  }

  var targetBranch = _.chain(branches[2]).split(":").last().value();
  return `${_.head(branches)}@${branches[1]}${targetBranch}`;
}

function getMergeRequestId() {
  return $("body").attr("data-page-type-id");
}

function reIndexFormGroup($container) {
  $container.find(".form-model").each(function(index, elem) {
    $(elem).closest(".group-item").attr("index", index + 1);
  });
}

function getModelValue(key) {
  var $formModel = getModelElement(key);

  if ($formModel.is(":radio")) {
    return $formModel.closest(".form-group").find(":checked").val();
  }

  if (!$formModel.attr("group")) {
    return _.trim($formModel.val());
  }

  var values = _.map($formModel, function(elem) {
    return $(elem).val();
  });

  return _.chain(values).map(_.trim).compact().value();
}

function setDefaultModelValue(value, key) {
  var $formModel = getModelElement(key);

  if ($formModel.attr("group")) {
    var $container = $formModel.closest(".group-container");
    var $addMoreButton = $container.find(".btn-add-more");

    for (let i = $formModel.length; i < value.length; i++) {
      $addMoreButton.trigger("click");
    }

    $container.find(".form-model").each(function(index, elem) {
      $(elem).val(value[index]).trigger("change");
    });

    return;
  }

  if (!$formModel.is(":radio")) {
    return $formModel.val(value);
  }

  _.forEach($formModel, function(elem) {
    $(elem).prop("checked", $(elem).attr("value") == value).trigger("change");
  });
}

function getModelElement(key) {
  return $(`.form-model[model="${key}"]`);
}

function formatHowToWorkContents() {
  if (hasMultipleLine(MB.template.howToWork)) return;
  MB.template.howToWorkFormat = `* ${MB.template.howToWork}`;
}

function formatCodeGrepContents() {
  var codeGrepBefore = formatCodeGrep("codeGrepBefore");
  var codeGrepAfter = formatCodeGrep("codeGrepAfter");

  MB.template.codeGrepFormat = _.chain([codeGrepBefore, codeGrepAfter])
    .compact().join("\n\n").value();
}

function formatCodeGrep(key) {
  MB.template[key] = _.chain(MB.template[key]).compact().value();
  if (_.isEmpty(MB.template[key])) return "";

  var title = _.get(MB.codeGrepMapping, key);
  var textResult = MB.template[key];

  textResult = _.map(textResult, function(text) {
    return `\`\`\`\n${text}\n\`\`\``;
  });

  textResult = _.join(textResult, "\n\n");
  textResult = `<summary>${title}</summary>\n\n${textResult}`;
  return addTabToText(`<details>\n${addTabToText(textResult)}\n</details>`, 2)
}

function formatTestContents() {
  MB.template.testCases = _.chain(MB.template.testCases).compact().value();

  var formattedTestCases = _.map(MB.template.testCases, function(text, index) {
    return formatTestCase(text, index);
  });

  MB.template.testCasesFormat = _.join(formattedTestCases, "\n\n");
}

function formatTestCase(text, index) {
  var title = _.chain(text).split("\n").head().value();

  text = _.replace(text, title, `<summary>${index + 1}. ${title}</summary>\n`);
  return addTabToText(`* <details>\n${addTabToText(text)}\n</details>\n`, 2);
}

function formatTicketTitle() {
  var formattedTicket = _.replace(MB.template.ticket, TICKET_REGEX, TICKET_REPLACE);

  formatMultipleLine("ticket", 2, formattedTicket);
}

function formatTemplateValue(model) {
  var key = $(model).attr("model");
  MB.template[key] = getModelValue(key);

  switch (key) {
    case "ticket":
      formatTicketTitle();
      break;
    case "testCases":
      formatTestContents();
      break;
    case "howToWork":
      formatHowToWorkContents();
    case "codeGrepBefore":
    case "codeGrepAfter":
      formatCodeGrepContents();
      break;
    case "editedPart":
    case "reasonDetail":
    case "reproduce":
    case "impactedFunction":
    case "impactedScreen":
    case "considerContent":
      formatMultipleLine(key, 2);
      break;
    case "note":
      formatMultipleLine(key, 1);
  }
}

function detectCompletedSection() {
  _.forEach(_.keys(MB.templateSection), function(section) {
    var tabSelector = `#v-${_.kebabCase(section)}-tab`;
    $(tabSelector).toggleClass("completed-section", isCompletedSection(section));
  });
}

function isCompletedSection(section) {
  var fields = _.get(MB.templateSection, section);

  return !_.chain(MB.template).pick(fields).values()
    .map(_.trim).some(_.isEmpty).value();
}

function detectInputtedSections() {
  var inputtedSections = _.chain(MB.templateSection).keys()
    .filter(isInputtedSection).value();

  return _.map(inputtedSections, function(section) {
    return `${section}Section`;
  });
}

function isInputtedSection(section) {
  var fields = _.get(MB.templateSection, section);

  return !_.chain(MB.template).pick(fields).values().every(_.isEmpty).value();
}

function replaceTemplateValue(templateText, key, value) {
  var bindValue = _.get(MB.template, key + "Format", value);
  var replaceRegex = _.trim(bindValue) ? `{${key}}` : `\n?.*{${key}}`;

  return _.replace(templateText, RegExp(replaceRegex, "gm"), bindValue);
}

function formatMultipleLine(key, tabSize = 1, text = "") {
  var value = text || _.get(MB.template, key);
  var textResult = addTabToText(value, tabSize);

  textResult = hasMultipleLine(textResult) ? "\n\n" + textResult : textResult;
  _.set(MB.template, `${key}Format`, textResult);
}

function addTabToText(text, tabSize = 1) {
  var lines = _.chain(text).trim().split("\n").value();
  var tabText = DEFAULT_INDENT.repeat(tabSize);

  lines = _.map(lines, function(line) {
    return `${tabText}${line}`
  });

  return _.join(lines, "\n");
}

function hasMultipleLine(text) {
  return text.match(/\n/);
}
