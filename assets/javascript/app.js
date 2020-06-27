$(document).ready(function(){

    //reset button
$("#reset-btn").on("click", function() {
    $("#title-search").css("background-color", "transparent");
    $("#author-search").css("background-color", "transparent");
    $("#results-container").empty();
});


        // Submit function for search
$("#submit-btn").click(function(event) {
    event.preventDefault();

        // Variables for Search
    var searchBook = $("#title-search").val().trim();
    var searchAuth = $("#author-search").val().trim();
    
//form validation
function formEmpty() {
    if(!searchBook && !searchAuth){
        $("#title-search").css({"background-color": "#f99603", "font-weight": "bold"});
        $("#author-search").css({"background-color": "#f99603", "font-weight": "bold"});
    }
    else if(!searchBook && $("#author-search").val()){
        $("#title-search, #author-search").css("background-color", "transparent");
    }
    else if(!searchAuth && $("#title-search").val()){
        $("#author-search, #author-search").css("background-color", "transparent");
    }
    else{
        searchBooks();
    }

};

formEmpty();

searchBooks();//need this here for the formEmpty (if) to work once user inputs a value


function searchBooks() {
        // Google Books URL
    var queryURL = "https://www.googleapis.com/books/v1/volumes?api_key=AIzaSyC_kBKxX1bOeYZ9z3Itd5x86QwbLL-uS_8&q=" + searchBook + searchAuth
     
    //console.log(queryURL)
        // Ajax for Google Books
   $.ajax({
        url: queryURL,
        method: "GET"
   }).then(function(response) {

        $("#results-container").empty();

        var count = 0;
          //for loop for results needs to be updated to limit response to 10 results and then needs to have a clear function as well as links to HTML added (this is not working yet)
        for(var i = 0; i < response.items.length; i++) {
    
            //Variables for results
            var title = response.items[i].volumeInfo.title;
            var author = response.items[i].volumeInfo.authors;
            var date = response.items[i].volumeInfo.publishedDate;
            var descript = response.items[i].volumeInfo.description;
            var image = response.items[i].volumeInfo.imageLinks.smallThumbnail;

            if(image == "undefined"){
                image = "https://via.placeholder.com/150"
            }

            count++ 
        
            var bookImg = $("<img>").attr("src", image).addClass("SearchImage").attr("id", "bookImg"+ count)

            var addBtn =$("<button>").addClass("addBook").text("Add Book").attr("id","bookBtnNum" + count);

            var yourResults = $("<div>");
            yourResults.html("<h6>" + 
            "<b>Title:  </b>" + title + "<br>" +
            "<b>Author:  </b>" + author + "<br>" +
            "<b>Date:  </b>" + date + "<br>" +
            "<b>Description: </b>" + descript + "<br>").attr("id", "results" + count).addClass("googleResult").prepend(bookImg);
            yourResults.append(addBtn);
        
                //sends results to results div       
            $("#results-container").append(yourResults);
            
                    //this is needed or error appears thank you google :)
            document.cookie = 'cross-site-cookie=bar; SameSite=Lax';  

}; //close for the loop


}); //close for .then


//adding to Reading List 
  $(document.body).on("click", ".addBook", function () {
    var btnNum= $(this).attr("id");
    var grabbedBook = $(this).parent(".googleResult");
    $(".readingList").append("<br>", grabbedBook).css({"margin-left": "0px", "color": "white"});
    $("#"+btnNum).remove()
});


}//close for function searchBooks
}); //close for submit button 

//NYT API - BESTSELLERS
var mvAPI = "XrPZZH0SkeXWEk4ExM3vIM4gh2neOKwv";
// // NYT testing API Key. the use of  "current" which means getting the latest list 
var queryURL="https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=" + mvAPI;
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {

    var bestsellers = response.results.books 
    var count=0;

    for(var j = 0; j < 5; j++) {

        var bookTitle= bestsellers[j].title;
        var bookAuth=bestsellers[j].author;
        var bookImg=bestsellers[j].book_image;
        var bookSynp= bestsellers[j].description;
        var bookRating= bestsellers[j].rank;

        
        count++;
        //created Img tag for  bookImg
        var booksImgHolder = $("<img>").attr("src",bookImg).attr("id", count).addClass("bestSellersImg").css("width", "100px");
        var bestSellersBtn = $("<button>").text("Save").attr("id", "button" + count).addClass("bestSellersBtn")
        //all the info to be display 
        var bestSellersInfo= $("<p>").html(
            "<b>Rank " + bookRating  + "</b><br>" + 
            "Title: " + bookTitle + "<br>" + 
            "Author: " + bookAuth + "<br>"  +
            "Synopsis: " + bookSynp + "<br>" 
             );
        //displaying on html
        $("#best-sellers-container").append(booksImgHolder);

        var infoDiv = $("<div>").html(bestSellersInfo).attr("id", "showInfo" + count).append(bestSellersBtn)
        $("#best-sellers-container").append(infoDiv);
        $(infoDiv).addClass("infoDiv").attr("data-hid","hidden");
        $("#showInfo" + count).hide();
    };//for loop close 

//creating on click for each book img to show info about book 
    $(".bestSellersImg").on("click", function() {
        $(".infoDiv").hide();
        var attrShown= $(this).attr("id");
        var showMore= function (){
            $("#showInfo"+ attrShown).show();
        }
        var hideInfo= function () {
            $("#showInfo"+ attrShown).hide();
        }
     
      showMore()
    
        
    });

    //adding best sellers to reading list ---still in progress---
    $(document.body).on("click", ".bestSellersBtn", function () {
        var btnNumAgain= $(this).attr("id");
        var bestSellInfo = $(this).siblings("p");
        //need work to add bestSellersImg
        // var getBestSellImg= $(this).parent().parent().children("img").attr("src");
        // console.log(getBestSellImg)
        // $(".readingList").append("<img src=" + getBestSellImg + " " + " width='150px'>", bestSellInfo).css({"margin-left": "10px", "color": "white"});
        $(".readingList").append(bestSellInfo).css({"margin-left": "10px", "color": "white"});
        alert("added!")
        $("#"+btnNumAgain).remove()
    
    });


}); 

}); 