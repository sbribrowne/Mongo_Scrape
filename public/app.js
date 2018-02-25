$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    // Display articles
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br /> https://huffingtonpost.com" + data[i].link + "</p>");
  }
});

var modal = document.getElementById('notes');

// Saving notes
$(document).on("click", "p", function() {

  modal.style.display = "block";
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    
    .then(function(data) {
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      if (data.note) {
        $("#bodyinput").val(data.note.body);
      }
    });
});


$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      console.log(data);
      $("#notes").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});

//Closing modal
var span = document.getElementsByClassName("close")[0];
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
