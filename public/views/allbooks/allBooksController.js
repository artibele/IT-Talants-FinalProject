app.controller("AllBooksController",function($scope, $location , $http){

    $http.get("/api/loggedIn").then(function(res){
        console.log(res)
        
        if(res.data.message == "Logged"){

        } else {
            $location.path('/login');
    }
    });
    
    $scope.moreInfo = function (){
        $location.path('/moreInfo');
    }

}).directive("home-directive", function() {
    return {
        restrict : "E",
        template: "<h1> Opaaaaa </h1>"
    };
});