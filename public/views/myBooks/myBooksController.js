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


  $scope.deleteFavoriteBook = function (id, index) {
    var userEmail = JSON.parse(sessionStorage.getItem("user")).email;
    var user = JSON.parse(sessionStorage.getItem("user"));

    $http.post("/deleteFavoriteBook", { bookId: id, userEmail: userEmail }).then(function (res) {
      if (res.status == 200) {
        $scope.books.splice(index, 1)

        for (var index = 0; index < user.favoritesId.length; index++) {
          if (id == user.favoritesId[index]) {
            var indexId = index;
          }
        }
        console.log(user.favoritesId.splice(indexId, 1))
        console.log(user)
    
        sessionStorage.setItem("user", JSON.stringify(user));
    

      }
    }).catch(function (res) {
      console.log(res)
    })

    $http.post("/deleteIdFromFavorites", { bookId: id, userEmail: userEmail }).then(function (res) {
      if (res.status == 200) {

      }
    }).catch(function (res) {
      console.log(res)
    })
  }


  // $location.search('centre', hash).replace();
});