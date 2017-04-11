$(document).ready(function(){
   $('#search-button').on('click', search);
});


/**
 * Search function.
 * @param e
 */
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
    var card = document.createElement("div"),
        text = document.createElement("p"),
        image = document.createElement("img"),
        grid = document.createElement("div"),
        cardImage = document.createElement("div"),
        cardContent = document.createElement("div"),
        viewMore = document.createElement("a"),
        addIcon = document.createElement("i");

    card.className += ("card");
    grid.className += ("col s12 m6 l4");
    cardImage.className += ("card-image");
    cardContent.className += ("card-content");
    viewMore.className += ("btn-floating halfway-fab waves-effect waves-light red");
    addIcon.className += ("material-icons");

    //text.href = resultObject.url;
    text.textContent = truncate(resultObject.title);
    cardContent.append(text);

    if (isImageUrl(resultObject.url)){
        image.src = resultObject.url;
        image.setAttribute("height", 300);
    } else {
        image.src = "img/cats.jpg";
    }

    addIcon.textContent = "add";

    viewMore.append(addIcon);

    cardImage.append(image);
    cardImage.append(viewMore);


    $(card).append(cardImage);
    $(card).append(cardContent);

    $(grid).append(card);

    $("#results").append(grid);
}

/**
 * Tests url string to validate that is is an image.
 * @param url
 * @returns {boolean}
 */
function isImageUrl(url){
    return (/\.(gif|jpg|jpeg|tiff|png)$/i).test(url);
}

function truncate(string){
    if (string.length > 35)
        return string.substring(0,35)+'...';
    else
        return string;
};