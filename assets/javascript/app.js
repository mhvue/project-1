$(document).ready(function(){
    //reset button
$("#reset-btn").on("click", function() {
    $("#title-search").css("background-color", "transparent");
    $("#author-search").css("background-color", "transparent");
    $("#results-container").empty().html("<p>No Search Result Yet </p>");
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
        
            var bookImg = $("<img>").attr("src", image).addClass("SearchImage").attr("id", "bookImg"+ count);
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
        console.log(response)
        var bestsellers = response.results.books 
        //console.log(bestsellers)
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
            var bestSellersBtn = $("<button>").text("Save").attr("id", count).addClass("bestSellersBtn").attr("data-notsaved","notSaved");
            //all the info to be display 
            var bestSellersInfo= $("<p>").html(
                    "<b>Rank " + bookRating  + "</b><br>" + 
                    "Title: " + bookTitle + "<br>" + 
                    "Author: " + bookAuth + "<br>"  +
                    "Synopsis: " + bookSynp + "<br>");
               
            //displaying on html
            $("#best-sellers-container").append(booksImgHolder);
            var infoDiv = $("<div>").html(bestSellersInfo).attr("id", "showInfo" + count).append(bestSellersBtn)
            $("#best-sellers-container").append(infoDiv);
            $(infoDiv).addClass("infoDiv");
            $("#showInfo" + count).hide();
        };//for loop close 

    //creating on click for each book img to show info about book 
        $(".bestSellersImg").on("click", function() {
            $(".infoDiv").hide();
            var attrShown= $(this).attr("id");
            $("#showInfo"+ attrShown).show();
        });
}); 

//add book from Google Search Results  to Reading list 
 $(document.body).on("click", ".addBook,.removeBook", function () {
    $("#noneMsg").remove();
    var $this = $(this);
    console.log($this)
    var grabbedBook = $this.parent(".googleResult");

    if($this.hasClass("addBook")){
        $(".saveModal").modal("toggle");
        $(".readingList").append("<br>", grabbedBook).css({"color": "white"});
        $this.text("Delete").removeClass("addBook").addClass("removeBook");
    }
     //deleting from saved Reading list to go back to Google Search Results 
    else{
        $("#results-container").prepend("<br>", grabbedBook);
        $this.text("Add Book").removeClass("removeBook").addClass("addBook");

    }
     
});

//adding to Reading List from Bestsellers
$(document.body).on("click", ".bestSellersBtn, .copyRemoveBestSellers", function () {
    $("#noneMsg").remove();
    var bestSellAttr= $(this).attr("id");
    var bestSellInfo = $(this).siblings("p");
    var $this= $(this);
    var getBestSellImg= $("#"+ bestSellAttr).parent().parent().find("#" + bestSellAttr);
    
    //avoid duplication of BestSellers in Readling List
    if($this.attr("data-saved")){
        $(".duplicateSaveModal").modal("toggle")
        return;
    }

    //append a copy of Bestseller book info to Reading list
    else if($this.hasClass("bestSellersBtn")) {
        $(".saveModal").modal("toggle");
        getBestSellImg.clone().addClass("copyBestSellerImg").removeAttr("id").appendTo(".readingList");
        bestSellInfo.clone().addClass("copyBestSellerInfo").removeAttr("id").appendTo(".readingList").attr("id","cloneInfo" + bestSellAttr)
        $this.clone().removeClass("bestSellersBtn").addClass("copyRemoveBestSellers").text("Delete").appendTo(".readingList").removeAttr("id");
        $this.text("Saved!").attr("data-saved","nowSaved").removeAttr("data-notsaved", "notSaved").addClass("removeSaved")
    }

   //removed the Bestseller book from Reading list BACK to Bestseller  
    else{  
        $(".removeSaved").text("Save").removeAttr("data-saved").attr("data-notsaved","notSaved");
         $(".copyBestSellerImg, .copyBestSellerInfo, .copyRemoveBestSellers").remove();//this removes all the clones
        $(".copyBestSellerImg,.copyRemoveBestSellers").remove();
       // $("#cloneInfo"+bestSellAttr).remove() //trying to get this to work so it deltes info on that specific book only
    }
});


}); 