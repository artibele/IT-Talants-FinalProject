app.controller("isAdminController",function($scope,$location,$window){

    var user = JSON.parse(sessionStorage.getItem("user"));
    
        $scope.$watch(function(){
            return $window.sessionStorage.getItem("user");
        }, function(value){
            if(!value){
                $scope.isAdmin = false;
                return;
            } 
            var user = JSON.parse(value);
            if(user.role == "admin"){
                $scope.isAdmin = true;
            } else {
                $scope.isAdmin = false;
            }
            
        })
})