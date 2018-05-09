app.controller("logoutController",function($scope, $http, $location, $window){

    var user = JSON.parse(sessionStorage.getItem("user"));
    
        $scope.$watch(function(){
            return $window.sessionStorage.getItem("user");
        }, function(value){
                var user = JSON.parse(value);
                if(!user){
                    $scope.isLogged = false;
                } else {
                    $scope.isLogged = true;
                }
                console.log($scope.isLogged);
        })
        

    $scope.logout = function (){

        $http.get("/api/loggedIn").then(function(res){
            if(res.data.message == "Logged"){
                $http.get("/users/logout").then(function(response){
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