$(document).ready(function(){
   $('#search-button').on('click', search);
    $('#spinner').hide();
    $('select').material_select();
});


/**
 * Search function.
 * @param e
 */
function search(e) {
    console.log("Request fired!");
    $('#spinner').show();

    e.preventDefault();
    clearPreviousSearchResults();

    var myQuery = $('#query').val() || $('#query').attr("placeholder"),
        url = "https://www.reddit.com/search.json";

     $.get(url, {
         q: myQuery
     }).done(function(responseData){
         $('#spinner').hide();
         var searchResults = responseData.data.children;
         for (var key in searchResults) {
             addNewSearchResults(searchResults[key].data);
         }
     }).fail(function(error){
         $('#spinner').hide();
         var errorCode = "Error ";
         console.log("Something went wrong:", error.status);
         if (error.status === 404) {
             errorCode += "404. Page not found.";
         } else if (error.status === 503) {
             errorCode += "503. Service unavailable.";
         } else if (error.status === 400) {
             errorCode += "400. Bad request.";
         } else if (error.status === 403) {
             errorCode += "403. Forbidden.";
         } else if (error.status === 500) {
             errorCode += "500. Internal service error.";
         }
         $("#results").html("<h3 class='center-align red-text textdarken-4'>" + errorCode + "</h3>");
     });
}

/**
 * Removes all search results from the Results div
 */
function clearPreviousSearchResults(){
    $("#results").html("");
}

/**
 * Creates HTML elements and appends them to the Results div
 * @param resultObject
 */
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

    viewMore.href = resultObject.url;

    text.textContent = truncateTextContent(resultObject.title);
    cardContent.append(text);

    image.setAttribute("height", 300);

    if (isImageUrl(resultObject.url)){
        image.src = resultObject.url;
    } else {
        // image.src = "img/cats.jpg";
        image.setAttribute("background-color", "red");
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

/**
 * Truncates text content if string is longer than 35 characters. Prevents formatting screwups.
 * @param string
 * @returns {*}
 */
function truncateTextContent(string){
    if (string.length > 35)
        return string.substring(0,35)+'...';
    else
        return string;
}


