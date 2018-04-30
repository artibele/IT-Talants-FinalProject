app.controller("AllBooksController",function($scope, $location , $http){
    $scope.imagess = [{
        src: 'views/img/wall1.jpg',
        title: 'Pic 1'
      }, {
        src: 'views/img/wall2.jpg',
        title: 'Pic 2'
      }, {
        src: 'views/img/wall3.jpg',
        title: 'Pic 3'
      }, {
        src: 'views/img/wall4.jpg',
        title: 'Pic 4'
      }
    ];
    
    
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
    
    $scope.moreInfo = function (_id){
        $location.path('/moreInfo/').search({id:_id});    
        
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
