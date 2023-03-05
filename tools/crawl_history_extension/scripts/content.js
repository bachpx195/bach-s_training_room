window.onload = async function() {
  var result = []
  $('*[data-testid="OrderHistory"]')[0].click()
  setTimeout(function() {
    $('*[data-testid="DataTable"]')[0].children[0].children[0].children[1].children[3].click()
  }, 4000);
  setTimeout(function() {
    var list = $('*[data-testid="DataTable"]')[0].children[1].children[1].children
    // for (let item of list) {
    //   // result.push({

    //   // })
    //   console.log(item.children[0]);
    // }
    for (var i = 1; i < list.length - 1; i++) {
      var childList = list[i].children[0].children[0].children;
      debugger
      // for (var j = 0; j < childList.length; j++) {
      //   console.log(childList[j]);
      // }
      // console.log(childList[1].textContent);
      result.push({
        time: childList[1].textContent
      })
    }
    // $('*[data-testid="DataTable"]')[0].children[1].children[1].children('div').each(function () {
    //     // alert(this.value); // "this" is the current element in the loop
    //     // console.log($(this));
    // });
    console.log("aaa")
    console.log(result)
  }, 6000);
};
