app.controller("HomeController",function($scope, $location , $http){
    $http.get("/api/loggedIn").then(function(res){
        console.log(res)
        
        if(res.data.message == "Logged"){

        } else {
            $location.path('/login');
    }
    });

});