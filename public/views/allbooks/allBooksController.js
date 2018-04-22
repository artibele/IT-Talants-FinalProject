app.controller("AllBooksController",function($scope, $location , $http){

    $http.post("/api/loggedIn").then(function(res){
        console.log(res)
        if(res.data.message == "Logged"){


        } else {
            $location.path('/login');
    }
    })
});