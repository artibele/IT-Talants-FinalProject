app.controller("LoginController",function($scope, $location , $http){
    $scope.login = function (){
        // var user = {
        //     username : $scope.user.username,
        //     password : $scope.user.password
        // }
        var username = $scope.user.username;
        var pass = $scope.user.password;
       
        var user =  userStorageLogin.showLogedUser(username,pass);
        var res = $http.post("/loginUser", user).then(function(res){
            
            // console.log(res.status);
            if(res.status == 200){
                // TODO LOCALSTORAGE 
                // $sessionStorage.setItam("user", res.data);
                sessionStorage.user = JSON.stringify(res.data);
                $scope.user = JSON.parse(sessionStorage.user);
                $location.path('/allBooks')
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