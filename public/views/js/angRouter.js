var app = angular.module("bookApp",["ngRoute"]);

app.config(function($routeProvider){
    $routeProvider
        .when("/login",{
            templateUrl: "views/login/login.htm",
            controller:"LoginController"
        })
        .when("/register",{
            templateUrl: "views/register/register.htm",
            controller:"RegisterController"
        })
        .when("/allBooks",{
            templateUrl: "views/allbooks/allBooks.htm",
            controller:"AllBooksController"
        })
        // po definicq mi pokaji
        
});