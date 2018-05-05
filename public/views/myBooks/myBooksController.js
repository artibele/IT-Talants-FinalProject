app.controller("MyBooksController", function ($scope, BookService, $location, $http) {
  // BookService.getAllBooks().then(books => {
  //   $scope.books = books.data;
  // })

  $http.get("/api/loggedIn").then(function (res) {
    console.log(res)

    if (res.data.message == "Logged") {
        
    } else {
        $location.path('/login');
    }
});
  var userEmail = JSON.parse(sessionStorage.getItem("user")).email;
  
  $http({
    url: "getFavorite",
    method: "POST",
    data: { userEmail: userEmail }
  }).then(function (res) {
    $scope.books = res.data.books;

  }, function (err) {
    console.log(err);
  })


  $scope.moreInfo = function (_id) {
    $location.path('/moreInfo/').search({ id: _id });
  }

  $scope.deleteFavoriteBook = function(id){
    
  }


  // $location.search('centre', hash).replace();
});