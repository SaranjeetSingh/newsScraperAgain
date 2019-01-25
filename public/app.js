$(document).on("click", "#newsHome", function() {
  $.getJSON("/articles", function(data) {
    $("#articlesNews").hide();
    $("#articles").empty();
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
        $("#articles").append("<div class='card'><h5 class='card-header'>" + data[i].headline + "</h5><div class='card-body' data-id='" + data[i]._id + "'><p class='card-text'>"+ data[i].summary + "</p><a  class='btn btn-primary save-article'>Save Article</a></div></div>");
    }
   
  });
});

  // Whenever someone clicks a p tag
  $(document).on("click", "#scrapeButton", function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
    .then(function(data){
        $("#articles").empty();
        $.getJSON("/articles", function(data) {
            $("#articlesNews").hide();
            // For each one
            for (var i = 0; i < data.length; i++) {
              // Display the apropos information on the page
                $("#articles").append("<div class='card'><h5 class='card-header'>" + data[i].headline + "</h5><div class='card-body' data-id='" + data[i]._id + "'><p class='card-text'>"+ data[i].summary + "</p><a  class='btn btn-primary save-article'>Save Article</a></div></div>");
            }
            alert("Scraped " +  data.length + " articles!!!");
          });
          

    });
    var elem;
    $(document).on("click", ".save-article", function() {
        elem = $(this);
        var id = $(this).parent().attr("data-id");

        $.ajax({
            method: "GET",
            url: "/savearticle/" + id,
            success: success
        })
        function success(res){
            alert("Article Saved!!");
            $(elem).parent().parent().remove();
        }
    });
   
    $(document).on("click", "#savedArticles", function() {
        $.ajax({
            method: "GET",
            url: "/savedArticles"
            // success: success
        })
        .then(function(data){
            $("#articles").empty();
            for (var i = 0; i < data.length; i++) {
                // Display the apropos information on the page
                  $("#articles").append("<div class='card'><h5 class='card-header'>" + data[i].headline + "</h5><div class='card-body' data-id='" + data[i]._id + "'><p class='card-text'>"+ data[i].summary + "</p><a class='btn btn-primary delete-save'>Delete from Saved</a>&nbsp;&nbsp;<a  class='btn btn-primary article-note'>Article Notes</a></div></div>");
            }
        })
    });
    
    $(document).on("click", ".delete-save", function(){
        elem = $(this);
        var id = $(this).parent().attr("data-id")
        $.ajax({
            method: "GET",
            url: "/deleteSaved/" + id
        })
        .then(function(data){
            alert("Article deleted from saved list.");
            $(elem).parent().parent().remove();
        })
    });

    $(document).on("click", ".article-note", function(){
        var id = $(this).parent().attr("data-id");
        $("#del").hide();
        $.ajax({
            method: "GET",
            url: "/showNote/"+id
            // success: success
        })
        .then(function(data){
            $("#note-id").text(id);
            $('#myModal').modal('show')
            if(data){
                $("#notes").empty();
                $("#notes").append("<h2 id='noteinput'>" + data.note.title + "</h2>");
                $("#notes").append("<button id='del'>Delete</button>");
                $("#del").show();
                // $("#existingNote").text(data.note.title);
                // $("#cancel-note").html("<button type='button' class='close' aria-label='Close'><span aria-hidden='true'>&times;</span></button>");
            }
        })
        $("#note-id").text(id);
        $("#note-input").val("");
        $('#myModal').modal('show')
    });
    
    $(document).on("click", "#del", function(){
        var id = $(this).parent().parent().siblings().find("#note-id").text();
        $.ajax({
            method: "GET",
            url: "/deletenote/"+id
        })
        .then(function(data){
            $("#notes").empty();
            $("#myModal").modal('hide');
        });
    });
    
    // Empty the notes from the note section
    // $("#notes").empty();
    // // Save the id from the p tag
    // var thisId = $(this).attr("data-id");
  
    // // Now make an ajax call for the Article
    // $.ajax({
    //   method: "GET",
    //   url: "/articles/" + thisId
    // })
    //   // With that done, add the note information to the page
    //   .then(function(data) {
    //     console.log(data);
    //     // The title of the article
    //     $("#notes").append("<h2>" + data.title + "</h2>");
    //     // An input to enter a new title
    //     $("#notes").append("<input id='titleinput' name='title' >");
    //     // A textarea to add a new note body
    //     $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
    //     // A button to submit a new note, with the id of the article saved to it
    //     $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
    //     // If there's a note in the article
    //     if (data.note) {
    //       // Place the title of the note in the title input
    //       $("#titleinput").val(data.note.title);
    //       // Place the body of the note in the body textarea
    //       $("#bodyinput").val(data.note.body);
    //     }
    //   });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var id = $("#note-id").text();
    
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/saveNote/" + id,
      data: {
        // Value taken from title input
        title: $("#note-input").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $('#myModal').modal('hide')
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  