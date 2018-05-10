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
        var bookTitle = JSON.parse(sessionStorage.getItem("book")).title;
        var rating = $scope.ratings[0].current
        var user = JSON.parse(sessionStorage.getItem("user"));
        var isRated = false;
        for (var index = 0; index < user.ratedBooks.length; index++) {
            if (bookTitle == user.ratedBooks[index]) {
                isRated = true;
                break;
            }
        }
        if (isRated) {
            alert("You already rated that book");
            return;
        }

        $http.post("/moreInfoBook/saveBookToUser", { email: userEmail, bookId: bookId }).then(function (res) {
            if (res.status == 200) {
                console.log("Rated");
                alert("Thanks for your rates!\n\nRating: " + $scope.ratings[0].current + "/" + $scope.ratings[0].max + "\n")
            }
        }).catch(function (res) {
            console.log("Book is not rated")
        })

        $http.post("/moreInfoBook/saveUserRating", { rating: rating, bookId: bookId }).then(function (res) {
            if (res.status == 200) {
                $http.post("/moreInfoBook/newRating", { bookId: bookId }).then(function (res) {
                    if (res.status == 200) {
                        console.log(res.avgSum)
                    }
                }).catch(function (res) {
                    console.log(res)
                })
            }
        }).catch(function (res) {
            console.log(res)
        })
        $http.post("/moreInfoBook/voted", { bookId: bookId }).then(function (res) {
            if (res.status == 200) {

            }
        }).catch(function (res) {
            console.log(res)
        })

        user.ratedBooks.push(bookTitle);
        sessionStorage.setItem("user", JSON.stringify(user));

    }


});

