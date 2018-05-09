app.controller("LoginController", function ($scope, $location, $http) {
    $scope.login = function ($event) {
        event.preventDefault()
       
        // var username = $scope.user.username;
        // var pass = $scope.user.password;

        var user = userStorageLogin.showLogedUser($scope.user.username, $scope.user.password);
        var res = $http.post("/users/loginUser", user).then(function (res) {

            if (res.status == 200) {
                
                sessionStorage.user = JSON.stringify(res.data);
                $scope.user = JSON.parse(sessionStorage.user);
                $location.path('/allBooks')
            }
        }).catch(function (res) {
            if (res.status == 401) {
                alert("Wrong user/password, try again")
            }
            $scope.user.username = ''
            $scope.user.password = ''
            $location.path('/login');
        })
    }
});