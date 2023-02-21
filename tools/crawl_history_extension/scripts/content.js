window.onload = async function() {
  console.log("bach da o day")
  console.log("bach da o day")
  $('*[data-testid="OrderHistory"]')[0].click()
  setTimeout(function() {
    $('*[data-testid="DataTable"]')[0].children[0].children[0].children[1].children[3].click()
  }, 4000);
  setTimeout(function() {
    $('*[data-testid="DataTable"]')[0].children[1].children[1]
    debugger
    $('*[data-testid="DataTable"]')[0].children[1].children[1].children('div').each(function () {
        // alert(this.value); // "this" is the current element in the loop
        console.log($(this));
    });
  }, 6000);
};
