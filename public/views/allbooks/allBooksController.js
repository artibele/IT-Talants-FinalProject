app.controller("AllBooksController",function($scope, $location , $http){
    
    $http.get("/api/loggedIn").then(function(res){
        console.log(res)
        
        if(res.data.message == "Logged"){
            $http.get("/getAllBooks").then(function(response){
                console.log(response.data);
                if(response.status == 200){
                    $scope.books = response.data;
    
                }
            }).catch(function(err){
                console.log("noo response")
            })

        } else {
            $location.path('/login');
    }
    });
    
    $scope.moreInfo = function (){
        $location.path('/moreInfo');
    }

    $scope.deleteBook = function (id){
        console.log(id);
        $http.delete("/removeBook/" + id).then(function(){
            var index = $scope.books.findIndex(function(book){
                return book._id == id;
            })
            console.log(index);
            $scope.books.splice(index,1)
            console.log($scope.books)
        })
    }

    $scope.sortAZ = function(){
        $scope.books.sort(function(a,b){
            var bookA =  a.title;
            var bookB = b.title;
            if(bookA < bookB){
                return -1;
            }
            if(bookA > bookB){
                return 1;
            }
            if(bookA = bookB){
                return 0;
            }
            
        })
    }

    $scope.sortZA = function (){
        $scope.books.sort(function(a,b){
            var bookA =  a.author;
            var bookB = b.author;
            if(bookB < bookA){
                return -1;
            }
            if(bookB > bookA){
                return 1;
            }
            if(bookB = bookA){
                return 0;
            }
        })
    }


})
// .directive("home-directive", function() {
//     return {
//         restrict : "E",
//         template: "<h1> Opaaaaa </h1>"
//     };
// });