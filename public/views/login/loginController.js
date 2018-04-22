app.controller("LoginController",function($scope, $location , $http){
    $scope.login = function (){
        var user = {
            username : $scope.user.username,
            password : $scope.user.password
        }
        var res = $http.post("/loginUser", user).then(function(res){
            // console.log(res.status);
            if(res.status == 200){
                
                $location.path('/allBooks')
                console.log("asasasasas");
            }
        }).catch(function(res){
            if(res.status == 401){
                alert("Wrong user/password, try again")
            }
            $scope.user = '';
            $location.path('/login');
        })
    }
});