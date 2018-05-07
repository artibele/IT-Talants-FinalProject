app.controller('StarCtrl', function ($scope, $http) {


    $scope.rating = 0;
    $scope.ratings = [
        {
            current: 3,
            max: 5
        }];

    $scope.getSelectedRating = function (rating) {
        console.log(rating);
    }

    $scope.setMinrate = function () {
        $scope.ratings = [
            {
                current: 1,
                max: 5
            }];
    }

    $scope.setMaxrate = function () {
        $scope.ratings = [
            {
                current: 5,
                max: 5
            }];
    }

    $scope.sendRating = function () {
       
        var userEmail = JSON.parse(sessionStorage.getItem("user")).email;
        var bookId = JSON.parse(sessionStorage.getItem("book"))._id;
        var rating = $scope.ratings[0].current

        $http.post("/saveBookToUser", { email: userEmail, bookId: bookId }).then(function (res) {
            if (res.status == 200) {
                console.log("Rated");
                alert("Thanks for your rates!\n\nRating: " + $scope.ratings[0].current + "/" + $scope.ratings[0].max + "\n")
            }
        }).catch(function (res) {
            console.log("Book is not rated")
        })

        $http.post("/saveUserRating", { rating: rating, bookId: bookId }).then(function (res) {
            if (res.status == 200) {

            }
        }).catch(function (res) {
            console.log(res)
        })

        $http.post("/voted", {bookId: bookId }).then(function (res) {
            if (res.status == 200) {
                
            }
        }).catch(function (res) {
            console.log(res)
        })

        $http.post("/newRating", {bookId: bookId }).then(function (res) {
            if (res.status == 200) {
                
            }
        }).catch(function (res) {
            console.log(res)
        })

    }

});
