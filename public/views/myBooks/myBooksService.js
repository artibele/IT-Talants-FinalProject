app.service("BookService", function ($http) {
    this.getAllBooks = () => $http.get("https://restcountries.eu/rest/v2/all")


    // this.getFavoriteBooks = function () {
    //     var favoriteBooks = JSON.parse(sessionStorage.getItem("user")).favoriteBooks;
    //     $http.get("/getFavoriteBooks").then(function (res) {
    //         console.log(res)

    //         if (res.data.message == "Logged") {
    //             $http.get("/getAllBooks").then(function (response) {
    //                 console.log(response.data);
    //                 if (response.status == 200) {
    //                     $scope.books = response.data;

    //                 }
    //             }).catch(function (err) {
    //                 console.log("noo response")
    //             })

    //         } else {
    //             $location.path('/login');
    //         }

    //     });
    // }
});