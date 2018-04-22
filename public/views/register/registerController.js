app.controller("RegisterController",function($scope, $location , $http){

    $scope.registration = function () {
        //$scope.user = {};
        var fName = $scope.user.firstName;
        var sName = $scope.user.secondName;
        var username = $scope.user.username;
        var email = $scope.user.email;
        var password = $scope.user.password;
        var pic = $scope.user.userImgUrl;

        var sendUser = userStorageRegister.showUser(fName,sName,username,email,password,pic);
        if(sendUser == null){
            $scope.user = "";
            alert("invalid input");
            return;
        }
        
        var res = $http.post("/registerUser", sendUser); // post request from client => Server 
       if(res.status == 200){
        $scope.user = {};
        $location.path('/login')
       } else {
        alert("Try again");
        $scope.user = "";
        $location.path('/register')
       }
    }
    
});