app.controller("contactWithUsController", function($scope){
    console.log("opppp :d")
    $scope.IsVisible = false;

    $scope.contactWithUs = function () {
        console.log($scope.IsVisible)
       
        if($scope.IsVisible == false){
            $scope.IsVisible = true;
            console.log("daaaaaa")
        } else {
            console.log("neeee");
            $scope.IsVisible = false;
        }
    }


   

});