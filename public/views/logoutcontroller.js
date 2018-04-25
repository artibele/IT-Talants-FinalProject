app.controller("logoutController",function($scope, $http, $location){
    $scope.logout = function (){

        $http.get("/api/loggedIn").then(function(res){
            console.log(res)
            if(res.data.message == "Logged"){
                $http.get("/logout").then(function(response){
                    console.log(response);
                    sessionStorage.removeItem("user");
                    $location.path('/login');
                })
                
              
            } else {
                $location.path('/login');
        }
        });
    }
})