app.controller("logoutController",function($scope, $http, $location){
    $scope.logout = function (){

        $http.get("/api/loggedIn").then(function(res){
            if(res.data.message == "Logged"){
                $http.get("/logout").then(function(response){
                    sessionStorage.removeItem("user");
                    $location.path('/login');
                })
                
              
            } else {
                //DEV debug option , should be replaced with error message 
                console.log("not logged in")
                sessionStorage.removeItem("user");
                $location.path('/login');
        }
        });
    }
})