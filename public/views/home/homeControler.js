app.controller("HomeController",function($scope, $location , $http){
    
    $http.get("/api/loggedIn").then(function (res) {
        
        if (res.data.message == "Logged") {

            var user = JSON.parse(sessionStorage.getItem("user"));
            if(user.role == "user"){
                $location.path('/allBooks');
            } 
        } else {
            $location.path('/login');
        }
    });

    $scope.types = [
        {type:"romance"},
        {type:"science"},
        {type:"history"},
        {type:"cookbooks"},
        {type:"fantasy"},
        {type:"biographies"},
        {type:"comics"},
        {type:"travel"},
        {type:"health"},
        {type:"drama"}
    ]
    
    $scope.addNewBook = function () {
        $http.get("/api/loggedIn").then(function(res){
            if(res.data.message == "Logged"){
                
                

                var sendBook = userStorageAllBooks.showBook($scope.book.title, $scope.book.moreAboutBook,  $scope.book.author,  $scope.book.typeOfBook,
                    $scope.book.publisher,$scope.book.published.toLocaleDateString() ,$scope.book.pages,
                    $scope.book.aboutAuthor, $scope.book.price,$scope.book.linkToBuy,$scope.book.pictureBook);

                if(sendBook == null){
                    $scope.book = "";
                    alert("invalid input");
                    return;
                }

                $http.post("/books/addBookInList", sendBook).then(function(responseBook){
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