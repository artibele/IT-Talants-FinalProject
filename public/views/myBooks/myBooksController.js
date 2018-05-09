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
  var userFavoritesId = JSON.parse(sessionStorage.getItem("user")).favoritesId;

  $http.get("/getAllBooks").then(function (response) {
    console.log(response.data);
    var newData = [];
    for(var index1 = 0; index1 < userFavoritesId.length; index1++){
      for(var index2 = 0; index2 < response.data.length; index2++){
        if(userFavoritesId[index1] == response.data[index2]._id){
          newData.push(response.data[index2]);
        }
      }
    }
    if (response.status == 200) {
      console.log(newData)
      $scope.books = newData;
    }
}).catch(function (err) {
    console.log("noo response")
})


  $scope.moreInfo = function (_id) {
    $location.path('/moreInfo/').search({ id: _id });
  }


  $scope.deleteFavoriteBook = function (id, index) {
    var userEmail = JSON.parse(sessionStorage.getItem("user")).email;
    var user = JSON.parse(sessionStorage.getItem("user"));

    $http.post("/deleteIdFromFavorites", { bookId: id, userEmail: userEmail }).then(function (res) {
      if (res.status == 200) {
        $scope.books.splice(index, 1)

        for (var index = 0; index < user.favoritesId.length; index++) {
          if (id == user.favoritesId[index]) {
            var indexId = index;
          }
        }
        user.favoritesId.splice(indexId, 1);
        sessionStorage.setItem("user", JSON.stringify(user));
      }
    }).catch(function (res) {
      console.log(res)
    })
  }


  // $location.search('centre', hash).replace();
});