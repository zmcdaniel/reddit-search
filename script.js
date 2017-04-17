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
    e.preventDefault();
    clearPreviousSearchResults();
    $('#spinner').show();
    var myQuery = $('#query').val() || $('#query').attr("placeholder"),
        myLimit = $('#limit').val() || 25,
        mySort = $('#sort-by').val(),
        uri = "https://www.reddit.com/r/aww/search.json?";
    $.ajax({
        url: uri,
        method: "GET",
        crossDomain: true,
        data: {
            q: myQuery,
            restrict_sr: true,
            limit: myLimit,
            sort: mySort
        }
    }).done(function(responseData){
         $('#spinner').hide();
         var searchResults = responseData.data.children;
         for (var key in searchResults) {
             addNewSearchResults(searchResults[key].data);
         }
     }).fail(function(error){
        handleErrors(error);
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
    var results = $("#results"),
        message = create(resultObject);
    results.hide();
    results.append(message).fadeIn(1000);
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
 * Error handler for status codes
 * @param e
 */
function handleErrors(e){
    $('#spinner').hide();
    var errorCode = "Error ";

    if (e.status === 404) {
        errorCode += "404. Page not found.";
    } else if (e.status === 503) {
        errorCode += "503. Reddit's search is down!";
    } else if (e.status === 400) {
        errorCode += "400. Bad request.";
    } else if (e.status === 403) {
        errorCode += "403. Forbidden.";
    } else if (e.status === 500) {
        errorCode += "500. Internal service error.";
    } else if (e.status === 401) {
        errorCode += "401. Unauthorized."
    }

    var errorHTML = "<div class='center-align'>" +
                        "<a class='btn btn-floating btn-large pulse red'><i class='material-icons'>error</i></a>" +
                        "<br><h3 class='red-text textdarken-4'>" + errorCode + "</h3>" +
                    "</div>";

    console.log("Something went wrong:", e.status);

    $("#results").append(errorHTML);
    //$("#results").html("<div class='center-align'><a class='btn btn-floating btn-large pulse red'><i class='material-icons'>error</i></a><br><h3 class='red-text textdarken-4'>" + errorCode + "</h3></div>");
}

/**
 * If a post is an image, set the image. If it's a text post, use a default preview.
 * @param object
 * @returns {*}
 */
function setPreview(object){
    var img;
    if (!object.preview){
        return "img/text.png";
    } else {
        return object.preview.images[0].source.url;
    }
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

/**
 * Creates HTML cards populated with data from JSON reponse
 * @param object
 * @returns {string}
 */
function create(object) {
    var image = setPreview(object), text = truncateTextContent(object.title);
    return  "<div class='col s12 m6 l4'>" +
        "       <div class='card'>" +
        "           <div class='card-image'>" +
        "               <img src='" + image + "'>" +
        "               <a class='btn-floating halfway-fab waves-effect waves-light red' href='"+ object.url + "'><i class='material-icons'>add</i></a>" +
        "           </div>" +
        "           <div class='card-content'>" +
        "               <p>" + text + "</p>" +
        "           </div>" +
        "       </div>" +
        "   </div>";
}

