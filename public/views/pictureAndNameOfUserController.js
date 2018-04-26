app.controller("usernameAndPictureController",function($scope, $window){

    // var user = JSON.parse(localStorage.getItem("user"));
    // var user =  $scope.user = $window.sessionStorage.getItem("user");
    // $scope.user = $window.sessionStorage.getItem("user");
    // console.log("tedi2");
    // console.log(sessionStorage.length);
    // if($window.sessionStorage.getItem("user") != null){
    //     console.log(JSON.parse($window.sessionStorage.getItem("user")));
    // } else {
    //     console.log("no object ");
    // }

    // $http.get("/api/loggedIn").then(function(res){
    //     if(res.data.message == "Logged"){
    //         console.log("tedyyyyy");
    //     } else {
    //         $location.path('/login');
    // }
    // });

    var user = this;

    $scope.$watch(function(){
        return $window.sessionStorage.getItem("user");
    },function(value){
        if(value != null){
            var jdoc = JSON.parse(value)
            user.uFname = jdoc.firstName;
            user.profPic = jdoc.profilePic;
            user.uSname = jdoc.secondName;
        }else{
            user.uFname = "";
            user.profPic = "";
            user.uSname = "";
        }


    });
    user.update = function(value){
        $window.sessionStorage.setItem("user",value);


    }

});