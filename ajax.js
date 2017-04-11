$(document).ready(function(){
   $('#search-form').on('submit', search);
});

function search(e) {
    e.preventDefault();
    clearPreviousSearchResults();


}

/**
 * Removes all search results from the Results div
 */
function clearPreviousSearchResults(){
    $("#results").html("");
}

function addNewSearchResults(){

}