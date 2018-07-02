$(document).ready(function () {
  $( "ul#stockList li" ).click(function() {
    const uri = '/getstock/' + $(this).attr("data-stock");
    $.get(uri, function(data) {
      alert(data);
     });
  });
});
