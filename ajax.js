$(document).ready(function(){
   $('#search-button').on('click', search);
});

function search(e) {
    console.log("Request fired!");

    e.preventDefault();
    clearPreviousSearchResults();

    var myQuery = $('#query').val() || $('#query').attr("placeholder"),
        url = "https://www.reddit.com/search.json";

    $.get(url, {
        q: myQuery
    }).done(function(responseData){

        var searchResults = responseData.data.children;
        console.log(searchResults);
        console.log(typeof searchResults);

        for (var key in searchResults) {
            addNewSearchResults(searchResults[key].data);
        }

    }).fail(function(error){
        console.log("Something went wrong:", error.responseText.message);
    });

}

/**
 * Removes all search results from the Results div
 */
function clearPreviousSearchResults(){
    $("#results").html("");
}

function addNewSearchResults(resultObject){
    var newDiv = document.createElement("div"), link = document.createElement("a"), image = document.createElement("img");

    newDiv.addClass("card");

    link.href = resultObject.url;
    link.textContent = resultObject.title;



    $(li).append(link);

    $("#results").append(li);
}