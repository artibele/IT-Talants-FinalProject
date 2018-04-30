app.controller("MoreInfoController",function($scope, $location , $http){
   
    var params = $location.search();

     $http.get("/getInfoForAbook/" + params.id).then(function(response){
                console.log(response.data);
                $scope.book = response.data;
    });  
    
    
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

    $scope.templAboutBook = function (){
        $scope.one = true;
        $scope.two = false;
        $scope.three = false;
    }

    $scope.templAboutAuthor = function (){
        $scope.one = false;
        $scope.two = true;
        $scope.three = false;
    }

    $scope.userComments = function (){
        $scope.one = false;
        $scope.two = false;
        $scope.three = true;
    }

    
})