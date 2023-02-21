const SELECTOR = {
  mergeForm: ".merge-request-form",
  markdownContainer: "#issue_body",
  // markdownContainer: ".merge-request-form .md-area",
  markdownInput: "#issue_body",
  markdownWriteButton: ".js-md-write-button",
  mergeTitle: "#merge_request_title",
  showTemplateButton: "#btn-show-template",
  branchCode: ".merge-request-form .branch-selector code, .merge-request-form div.target_branch",
  templateDropdown: ".issuable-form-select-holder .js-issuable-selector"
};

const MB = {
  template: {
    ticket: "",
    editedPart: "",
    fromPR: "",
    reasonDetail: "",
    reproduce: "",
    howToWork: "",
    impactedFunction: "",
    impactedScreen: "",
    codeGrepFormat: "",
    testCasesFormat: "",
    hasChangeApi: "KHÔNG",
    hasUnitTest: "CHƯA",
    hasChangeOutsourcingText: "KHÔNG",
    hasConsiderOldVersion: "KHÔNG CẦN",
    testCases: [],
    codeGrepBefore: [],
    codeGrepAfter: [],
    note: ""
  },
  templateSection: {
    overview: [
      "ticket",
      "editedPart"
    ],
    reason: [
      "fromPR",
      "reasonDetail",
      "reproduce"
    ],
    work: [
      "howToWork"
    ],
    impactedArea: [
      "impactedFunction",
      "impactedScreen",
      "hasChangeApi",
      "hasChangeOutsourcingText",
      "codeGrepFormat"
    ],
    testedContent: [
      "hasUnitTest",
      "hasConsiderOldVersion",
      "testCasesFormat"
    ],
    note: [
      "note"
    ]

  },
  codeGrepMapping: {
    codeGrepBefore: "Trước khi sửa",
    codeGrepAfter: "Sau khi sửa"
  },
  links: [],
  isShowTemplate: true,
  templateHTML: `
<div class="mb-pr-template">
  <div class="row">
    <div class="col-3">
      <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
        <a class="nav-link mt-4 active" role="tab" data-toggle="pill" id="v-overview-tab"
          href="#v-overview" aria-controls="v-overview" aria-selected="true">
          <span>Tổng quan thị trường</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
          </svg>
        </a>
        <a class="nav-link" role="tab" data-toggle="pill" id="v-reason-tab"
          href="#v-reason" aria-controls="v-reason" aria-selected="false">
          <span>Mục tiêu giao dịch</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
          </svg>
        </a>
        <a class="nav-link" role="tab" data-toggle="pill" id="v-work-tab"
          href="#v-work" aria-controls="v-work" aria-selected="false">
          <span>Kế hoạch giao dịch</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
          </svg>
        </a>
        <a class="nav-link" role="tab" data-toggle="pill" id="v-impacted-area-tab"
          href="#v-impacted-area" aria-controls="v-impacted-area" aria-selected="false">
          <span>Ảnh hưởng</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
          </svg>
        </a>
        <a class="nav-link" role="tab" data-toggle="pill" id="v-tested-content-tab"
          href="#v-tested-content" aria-controls="v-tested-content" aria-selected="false">
          <span>Nội dung test</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
          </svg>
        </a>
        <a class="nav-link mb-4" role="tab" data-toggle="pill" id="v-note-tab"
          href="#v-note" aria-controls="v-note" aria-selected="false">
          <span>Điểm lưu ý</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
          </svg>
        </a>
      </div>
    </div>
    <div class="col-9 pl-2 pr-4">
      <div class="tab-content mt-4 mb-5" id="v-pills-tabContent">
        <div class="tab-pane fade show active" id="v-overview" role="tabpanel" aria-labelledby="v-overview-tab">
          <h4>Overview</h4>
          <div class="mt-4">
            <div class="form-group row">
              <div class="col-sm-12">
                <label>Ticket</label>
                <textarea class="form-model" model="ticket"></textarea>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-sm-12">
                <label>Phần đã sửa</label>
                <textarea class="form-model" model="editedPart"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="v-reason" role="tabpanel" aria-labelledby="v-reason-tab">
          <h4>Nguyên nhân</h4>
          <div class="mt-4">
            <div class="form-group row">
              <div class="col-sm-12">
                <label>Từ</label>
                <textarea class="form-model" model="fromPR"></textarea>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-sm-12">
                <label>Nguyên nhân</label>
                <textarea class="form-model" model="reasonDetail"></textarea>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-sm-12">
                <label>Tái hiện</label>
                <textarea class="form-model" model="reproduce"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="v-work" role="tabpanel" aria-labelledby="v-work-tab">
          <h4>Cách làm</h4>
          <div class="mt-4">
            <div class="form-group row">
              <div class="col-sm-12">
                <label>Cách làm</label>
                <textarea class="form-model" model="howToWork"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="v-impacted-area" role="tabpanel" aria-labelledby="v-impacted-area-tab">
          <h4>Phạm vi ảnh hưởng</h4>
          <div class="mt-4">
            <div class="form-group row">
              <div class="col-sm-12">
                <label>Chức năng</label>
                <textarea class="form-model" model="impactedFunction"></textarea>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-sm-12">
                <label>Màn hình</label>
                <textarea class="form-model" model="impactedScreen"></textarea>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-md-5 col-sm-6">
                <div class="form-check mt-1 pl-0">Có thay đổi API không?</div>
              </div>
              <div class="col-md-7 col-sm-6">
                <div class="form-check form-check-inline">
                  <input class="form-check-input form-model" type="radio"
                    model="hasChangeApi" name="hasChangeApi" id="hasChangeApiYes" value="CÓ">
                  <label class="form-check-label" for="hasChangeApiYes">Có</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input form-model" type="radio"
                    model="hasChangeApi" name="hasChangeApi" id="hasChangeApiNo" value="KHÔNG">
                  <label class="form-check-label" for="hasChangeApiNo">Không</label>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-md-5 col-sm-6">
                <div class="form-check mt-1 pl-0">Có sửa text outsourcing không?</div>
              </div>
              <div class="col-md-7 col-sm-6">
                <div class="form-check form-check-inline">
                  <input class="form-check-input form-model" type="radio" model="hasChangeOutsourcingText"
                    name="hasChangeOutsourcingText" id="hasChangeOutsourcingTextYes" value="CÓ">
                  <label class="form-check-label" for="hasChangeOutsourcingTextYes">Có</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input form-model" type="radio" model="hasChangeOutsourcingText"
                    name="hasChangeOutsourcingText" id="hasChangeOutsourcingTextNo" value="KHÔNG">
                  <label class="form-check-label" for="hasChangeOutsourcingTextNo">Không</label>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-sm-12">
                <span class="group-title">Grep trước khi sửa</span>
                <div class="group-container">
                  <div class="group-item d-flex">
                    <textarea class="form-model code" model="codeGrepBefore" group="true"></textarea>
                    <button type="button" class="gl-button btn btn-default btn-delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                      </svg>
                    </button>
                  </div>
                  <button type="button" class="gl-button btn btn-default btn-add-more">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="col-sm-12 mt-4">
                <span class="group-title">Grep sau khi sửa</span>
                <div class="group-container">
                  <div class="group-item d-flex">
                    <textarea class="form-model code" model="codeGrepAfter" group="true"></textarea>
                    <button type="button" class="gl-button btn btn-default btn-delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                      </svg>
                    </button>
                  </div>
                  <button type="button" class="gl-button btn btn-default btn-add-more">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="v-tested-content" role="tabpanel" aria-labelledby="v-tested-content">
          <h4>Nội dung đã test</h4>
          <div class="mt-4">
            <div class="form-group row">
              <div class="col-md-7 col-sm-6">
                <div class="form-check mt-1 pl-0">Đã có Unit Test cover chưa?</div>
              </div>
              <div class="col-md-5 col-sm-6">
                <div class="form-check form-check-inline">
                  <input class="form-check-input form-model" type="radio" model="hasUnitTest"
                    name="hasUnitTest" id="hasUnitTestYes" value="CÓ">
                  <label class="form-check-label" for="hasUnitTestYes">Có</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input form-model" type="radio" model="hasUnitTest"
                    name="hasUnitTest" id="hasUnitTestNo" value="CHƯA">
                  <label class="form-check-label" for="hasUnitTestNo">Chưa</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input form-model" type="radio" model="hasUnitTest"
                    name="hasUnitTest" id="hasUnitTestNotEnough" value="CHƯA ĐỦ">
                  <label class="form-check-label" for="hasUnitTestNotEnough">Chưa đủ</label>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-md-7 col-sm-6">
                <div class="form-check mt-1 pl-0">Cần cân nhắc ảnh hưởng tới data cũ/version app cũ không?</div>
              </div>
              <div class="col-md-5 col-sm-6">
                <div class="form-check form-check-inline">
                  <input class="form-check-input form-model" type="radio" model="hasConsiderOldVersion"
                    name="hasConsiderOldVersion" id="hasConsiderOldVersionYes" value="CÓ">
                  <label class="form-check-label" for="hasConsiderOldVersionYes">Có</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input form-model" type="radio" model="hasConsiderOldVersion"
                    name="hasConsiderOldVersion" id="hasConsiderOldVersionNo" value="KHÔNG CẦN">
                  <label class="form-check-label" for="hasConsiderOldVersionNo">Không cần</label>
                </div>
              </div>
            </div>
            <div class="form-group row" id="consider-content">
              <div class="col-sm-12">
                <label>Nội dung cân nhắc</label>
                <textarea class="form-model" model="considerContent"></textarea>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-sm-12">
                <span class="group-title">Test cases</span>
                <div class="group-container test-contents pl-5">
                  <div class="group-item with-index d-flex" index="1">
                    <textarea class="form-model" model="testCases" group="true"></textarea>
                    <button type="button" class="gl-button btn btn-default btn-delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                      </svg>
                    </button>
                  </div>
                  <button type="button" class="gl-button btn btn-default btn-add-more">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="v-note" role="tabpanel" aria-labelledby="v-note-tab">
          <h4>Điểm lưu ý</h4>
          <div class="mt-4">
            <div class="form-group row">
              <div class="col-sm-12">
                <label>Lưu ý</label>
                <textarea class="form-model" model="note"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`,

  templateButton: `
<div id="btn-show-template">
  <button type="button" class="btn btn-confirm gl-button ml-auto btn-on-template">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-magic" viewBox="0 0 16 16">
      <path d="M9.5 2.672a.5.5 0 1 0 1 0V.843a.5.5 0 0 0-1 0v1.829Zm4.5.035A.5.5 0 0 0 13.293 2L12 3.293a.5.5 0 1 0 .707.707L14 2.707ZM7.293 4A.5.5 0 1 0 8 3.293L6.707 2A.5.5 0 0 0 6 2.707L7.293 4Zm-.621 2.5a.5.5 0 1 0 0-1H4.843a.5.5 0 1 0 0 1h1.829Zm8.485 0a.5.5 0 1 0 0-1h-1.829a.5.5 0 0 0 0 1h1.829ZM13.293 10A.5.5 0 1 0 14 9.293L12.707 8a.5.5 0 1 0-.707.707L13.293 10ZM9.5 11.157a.5.5 0 0 0 1 0V9.328a.5.5 0 0 0-1 0v1.829Zm1.854-5.097a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L8.646 5.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0l1.293-1.293Zm-3 3a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L.646 13.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0L8.354 9.06Z"/>
    </svg>
    <span>Template</span>
  </button>
  <button type="button" class="btn gl-button ml-auto btn-on-markdown">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-code-slash" viewBox="0 0 16 16">
      <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/>
    </svg>
    <span>Markdown</span>
  </button>
</div>
`,

  templateHeaderTab: `
<li class="md-header-tab" id="btn-show-template">
  <button type="button" class="mb-template-button">MB Template</button>
</li>
`,

  overviewSection: `
## ■ Overview
  * Ticket: {ticket}
  * Phần đã sửa: {editedPart}
`,

  reasonSection: `
## ■ Nguyên nhân
  * Từ: {fromPR}
  * Nguyên nhân: {reasonDetail}
  * Cách tái hiện: {reproduce}
`,

  workSection: `
## ■ Cách làm/sửa

{howToWork}
`,

  impactedAreaSection: `
## ■ Phạm vi ảnh hưởng
  * Chức năng: {impactedFunction}
  * Màn hình: {impactedScreen}
  * Có thay đổi API (bao gồm cả thay đổi method name/input/output/params) không?: {hasChangeApi}
  * Có sửa text liên quan đến outsourcing không?: {hasChangeOutsourcingText}
  * Grep:

{codeGrepFormat}
`,

  testedContentSection: `
## ■ Nội dung đã test
  * Đã có Unit Test cover chưa?: {hasUnitTest}
  * Cần cân nhắc ảnh hưởng tới data cũ/version app cũ không?: {hasConsiderOldVersion}
  * Nội dung cân nhắc: {considerContent}
  * Nội dung test:

{testCasesFormat}
`,

  noteSection: `
## ■ Điểm lưu ý

{note}
`
}
