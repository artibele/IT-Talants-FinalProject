app.controller("RegisterController",function($scope, $location , $http){

    $scope.registration = function () {
       
        var sendUser = userStorageRegister.showUser($scope.user.firstName,$scope.user.secondName,
            $scope.user.username,$scope.user.email,$scope.user.password,$scope.user.userImgUrl);
        if(sendUser == null){
            $scope.user = "";
            alert("invalid input");
            return;
        }
        
        $http.post("/users/registerUser", sendUser).then(function(res) {
            if(res.status == 200){
                $scope.user = {};
                $location.path('/login')
               } else {
                alert("Try again");
                $scope.user = "";
                $location.path('/register')
               }
        }) // post request from client => Server 
        .catch(function(res){
            
        })
    }
    
});