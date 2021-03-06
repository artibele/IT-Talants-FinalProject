app.controller("AllBooksController", function ($scope, $location, $http, $window) {

    var user = JSON.parse(sessionStorage.getItem("user"));

    $scope.$watch(function(){
        return $window.sessionStorage.getItem("user");
    }, function(value){
        if(value){
            var user = JSON.parse(value);
            if(user.role == "admin"){
                $scope.isAdmin = true;
            } else {
                $scope.isAdmin = false;
            }
        } else {
            console.log('nooo value .. ')
        }
    })

   
    $scope.imagess = [{
        src: 'views/img/newBook1.jpg.png',
        title: 'Pic 1'
    }, {
        src: 'views/img/newBook2.jpg.png',
        title: 'Pic 2'
    }, {
        src: 'views/img/newBook3.jpg.png',
        title: 'Pic 3'
    }, {
        src: 'views/img/newBook4.jpg.jpg',
        title: 'Pic 4'
    }, {
        src: 'views/img/newBook5.jpg.jpg',
        title: 'Pic 4'
    } , {
        src: 'views/img/newBook6.jpg.jpg',
        title: 'Pic 4'
    } , {
        src: 'views/img/newBook7.jpg.jpg',
        title: 'Pic 4'
    } , {
        src: 'views/img/newBook8.jpg.jpg',
        title: 'Pic 4'
    } 
    ];

    $scope.addToFavorite = function (bookId) {
        var userEmail = JSON.parse(sessionStorage.getItem("user")).email;
        var user = JSON.parse(sessionStorage.getItem("user"));
        var isFavorite = false;
        for (var index = 0; index < user.favoritesId.length; index++) {
            if (bookId == user.favoritesId[index]) {
                isFavorite = true;
                break;
            }
        }
        if (isFavorite) {
            alert("This book is already added to favourites!");
            return;
        }

        $http.post("/books/addIdToFavorites", { email: userEmail, bookId: bookId }).then(function (res) {
            if (res.status == 200) {
                console.log("added id");
            }
        }).catch(function (res) {
            console.log("Book is not added")
        })

        user.favoritesId.push(bookId);
        sessionStorage.setItem("user", JSON.stringify(user));
    }

    // $http.get("/api/loggedIn").then(function (res) {
    //     console.log(res)

    //     if (res.data.message == "Logged") {
    //         $http.get("/getAllBooks").then(function (response) {
    //             console.log(response.data);
    //             if (response.status == 200) {
    //                 $scope.books = response.data;

    //             }
    //         }).catch(function (err) {
    //             console.log("noo response")
    //         })

    //     } else {
    //         $location.path('/login');
    //     }
    // });

    $http.get("/books/getAllBooks").then(function (response) {
        console.log(response.data);
        if (response.status == 200) {
            $scope.books = response.data;

        }
    }).catch(function (err) {
        console.log("noo response")
    })

    
    $scope.moreInfo = function (_id) {
        $location.path('/moreInfo/').search({ id: _id });

    }



    $scope.deleteBook = function (id) {
        console.log(id);
        $http.delete("/books/removeBook/" + id).then(function () {
            var index = $scope.books.findIndex(function (book) {
                return book._id == id;
            })
            console.log(index);
            $scope.books.splice(index, 1)
            console.log($scope.books)
        }).catch(function(res){
            if(res.status == 401 ){
                alert("You neeet to be logged")
            }
            if(res.status == 500){
                alert("An error occured , please try again later")
            }
        })
    }

    $scope.sortAZ = function () {
        $scope.books.sort(function (a, b) {
            var bookA = a.title;
            var bookB = b.title;
            if (bookA < bookB) {
                return -1;
            }
            if (bookA > bookB) {
                return 1;
            }
            if (bookA = bookB) {
                return 0;
            }

        })
    }

    $scope.sortZA = function () {
        $scope.books.sort(function (a, b) {
            var bookA = a.author;
            var bookB = b.author;
            if (bookB < bookA) {
                return -1;
            }
            if (bookB > bookA) {
                return 1;
            }
            if (bookB = bookA) {
                return 0;
            }
        })
    }

    $scope.allBooks = true;
    $scope.raomanceBook = false;
    $scope.scienceBook = false;
    $scope.historyBook = false;
    $scope.cookbooksBook  = false;
    $scope.fantasyBook  = false;
    $scope.biographiesBoook  = false;
    $scope.comicsBook  = false;
    $scope.travelBook  = false;
    $scope.healthBook  = false;
    $scope.dramaBook = false;

    $scope.allBook = function () {
        $scope.allBooks = true;
        $scope.raomanceBook = false;
        $scope.scienceBook = false;
        $scope.historyBook = false;
        $scope.cookbooksBook  = false;
        $scope.fantasyBook  = false;
        $scope.biographiesBoook  = false;
        $scope.comicsBook  = false;
        $scope.travelBook  = false;
        $scope.healthBook  = false;
        $scope.dramaBook = false;

        $http.get("/books/getAllBooks").then(function (response) {
            console.log(response.data);
            if (response.status == 200) {
                $scope.books = response.data;

            }
        }).catch(function (err) {
            console.log("noo response")
        })


    }
    
    $scope.romanceBook = function (){
       
        $scope.allBooks = false;
        $scope.raomanceBook = true;
        $scope.scienceBook = false;
        $scope.historyBook = false;
        $scope.cookbooksBook  = false;
        $scope.fantasyBook  = false;
        $scope.biographiesBoook  = false;
        $scope.comicsBook  = false;
        $scope.travelBook  = false;
        $scope.healthBook  = false;
        $scope.dramaBook = false;

        $http.get("/books/gettAllBookByGanre/" + "romance").then(function(res){
            $scope.romanceBooks = res.data;
        })
    }
    
    $scope.science = function(){
        $scope.allBooks = false;
        $scope.raomanceBook = false;
        $scope.scienceBook = true;
        $scope.historyBook = false;
        $scope.cookbooksBook  = false;
        $scope.fantasyBook  = false;
        $scope.biographiesBoook  = false;
        $scope.comicsBook  = false;
        $scope.travelBook  = false;
        $scope.healthBook  = false;
        $scope.dramaBook = false;

        $http.get("/books/gettAllBookByGanre/" + "science").then(function(res){
            $scope.scienceBooks = res.data;
        })
    }

    $scope.historyB = function(){
        $scope.allBooks = false;
        $scope.raomanceBook = false;
        $scope.scienceBook = false;
        $scope.historyBook = true;
        $scope.cookbooksBook  = false;
        $scope.fantasyBook  = false;
        $scope.biographiesBoook  = false;
        $scope.comicsBook  = false;
        $scope.travelBook  = false;
        $scope.healthBook  = false;
        $scope.dramaBook = false;

        
        $http.get("/books/gettAllBookByGanre/" + "history").then(function(res){
            $scope.historyBooks = res.data;
        })
    }

    $scope.cookbooks = function(){
        $scope.allBooks = false;
        $scope.raomanceBook = false;
        $scope.scienceBook = false;
        $scope.historyBook = false;
        $scope.cookbooksBook  = true;
        $scope.fantasyBook  = false;
        $scope.biographiesBoook  = false;
        $scope.comicsBook  = false;
        $scope.travelBook  = false;
        $scope.healthBook = false;
        $scope.dramaBook = false;

        $http.get("/books/gettAllBookByGanre/" + "cookbooks").then(function(res){
            $scope.cookbooksBooks = res.data;
        })
    }

    $scope.fantasy = function(){
        $scope.allBooks = false;
        $scope.raomanceBook = false;
        $scope.scienceBook = false;
        $scope.historyBook = false;
        $scope.cookbooksBook  = false;
        $scope.fantasyBook  = true;
        $scope.biographiesBoook  = false;
        $scope.comicsBook  = false;
        $scope.travelBook  = false;
        $scope.healthBook = false;
        $scope.dramaBook = false;

        $http.get("/books/gettAllBookByGanre/" + "fantasy").then(function(res){
            $scope.fantasyBooks = res.data;
        })
    }

    $scope.comics = function(){
        $scope.allBooks = false;
        $scope.raomanceBook = false;
        $scope.scienceBook = false;
        $scope.historyBook = false;
        $scope.cookbooksBook  = false;
        $scope.fantasyBook  = false;
        $scope.biographiesBoook  = false;
        $scope.comicsBook  = true;
        $scope.travelBook  = false;
        $scope.healthBook  = false;
        $scope.dramaBook = false;

        
        $http.get("/books/gettAllBookByGanre/" + "comics").then(function(res){
            $scope.comicsBooks = res.data;
        })

    }

    $scope.travel = function(){
        $scope.allBooks = false;
        $scope.raomanceBook = false;
        $scope.scienceBook = false;
        $scope.historyBook = false;
        $scope.cookbooksBook  = false;
        $scope.fantasyBook  = false;
        $scope.biographiesBoook  = false;
        $scope.comicsBook  = false;
        $scope.travelBook  = true;
        $scope.healthBook  = false;
        $scope.dramaBook = false;

        
        $http.get("/books/gettAllBookByGanre/" + "travel").then(function(res){
            $scope.trevalBooks = res.data;
        })
    }

    $scope.biographies = function(){
        $scope.allBooks = false;
        $scope.raomanceBook = false;
        $scope.scienceBook = false;
        $scope.historyBook = false;
        $scope.cookbooksBook  = false;
        $scope.fantasyBook  = false;
        $scope.biographiesBoook  = true;
        $scope.comicsBook  = false;
        $scope.travelBook  = false;
        $scope.healthBook  = false;
        $scope.dramaBook = false;

        $http.get("/books/gettAllBookByGanre/" + "biographies").then(function(res){
            $scope.biographiesBooks = res.data;
        })
    }

    $scope.health = function(){
        $scope.allBooks = false;
        $scope.raomanceBook = false;
        $scope.scienceBook = false;
        $scope.historyBook = false;
        $scope.cookbooksBook  = false;
        $scope.fantasyBook  = false;
        $scope.biographiesBoook  = false;
        $scope.comicsBook  = false;
        $scope.travelBook  = false;
        $scope.healthBook  = true;
        $scope.dramaBook = false;

        
        $http.get("/books/gettAllBookByGanre/" + "health").then(function(res){
            $scope.healthBooks = res.data;
        })
    }

    $scope.drama = function (){
        $scope.allBooks = false;
        $scope.raomanceBook = false;
        $scope.scienceBook = false;
        $scope.historyBook = false;
        $scope.cookbooksBook  = false;
        $scope.fantasyBook  = false;
        $scope.biographiesBoook  = false;
        $scope.comicsBook  = false;
        $scope.travelBook  = false;
        $scope.healthBook  = false;
        $scope.dramaBook = true;

        $http.get("/books/gettAllBookByGanre/" + "drama").then(function(res){
            $scope.dramaBooks = res.data;
        })

    }



})
