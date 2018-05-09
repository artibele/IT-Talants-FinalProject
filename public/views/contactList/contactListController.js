app.controller("ContactListController", function ($scope, $location, $http, $window) {

    $scope.sendMail = function(){
        var userMeil = {
            userName : $scope.userName,
            userPhone : $scope.userPhone,
            userEmail : $scope.userEmail,
            userText : $scope.userText
         }

     
         if((userMeil.userName == "") || (userMeil.userPhone == "") || (userMeil.userEmail == "") || (userMeil.userText == "") ){
            $scope.userName = "",
            $scope.userPhone = "",
            $scope.userEmail = "",
            $scope.userText = ""
            alert("Invalid data , Please try again .. ")
            return;
         }
     
         $http.post("/contactMeil/sendMeilToAdmin", userMeil).then(function(res){
             alert("Message sent");

            $scope.userName = "",
            $scope.userPhone = "",
            $scope.userEmail = "",
            $scope.userText = ""
    
         });
    }

})