app.controller("HomeController",function($scope, $location , $http){
    $scope.types = [
        {
            type:"romance"
        },
        {
            type:"science"
        },
        {
            type:"cookbooks"
        },
        {
            type:"fantasy"
        },
        {
            type:"biographies"
        },
        {
            type:"comics"
        },
        {
            type:"travel"
        },
        {
            type:"health"
        },
        {
            type:"drama"
        }
    ]
    $scope.addNewBook = function () {
        $http.get("/api/loggedIn").then(function(res){
            if(res.data.message == "Logged"){
                
                

                var title = $scope.book.title;
                var moreAboutbook = $scope.book.moreAboutBook;
                var author = $scope.book.author;
                var typeBook = $scope.book.typeOfBook;
                var publisher = $scope.book.publisher;
                var published = $scope.book.published.toLocaleDateString();
                var pages = $scope.book.pages;
                var aboutAuthor = $scope.book.aboutAuthor;
                var price = $scope.book.price;
                var linkToBuy = $scope.book.linkToBuy;
                var picture = $scope.book.pictureBook;
                console.log(published)
                console.log(aboutAuthor);

                var sendBook = userStorageAllBooks.showBook(title,moreAboutbook,author,typeBook,publisher,published,pages,aboutAuthor,price,linkToBuy,picture );
                if(sendBook == null){
                    $scope.book = "";
                    alert("invalid input");
                    return;
                }

                $http.post("/addBookInList", sendBook).then(function(responseBook){
                    $scope.book.title = "";
                    $scope.book.moreAboutBook = "";
                    $scope.book.author = "";
                    $scope.book.typeOfBook = "";
                    $scope.book.publisher = '';
                    $scope.book.published = ""
                    $scope.book.pages = "";
                    $scope.book.aboutAuthor = "";
                    $scope.book.price = "";
                    $scope.book.linkToBuy = "";
                    $scope.book.pictureBook  = "";
                    
                })
                .catch(function(res){
                    alert("Invalid Input")
                })
                
            } else {
                $location.path('/login');
        }
        })
    }

});