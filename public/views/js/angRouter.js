var app = angular.module("bookApp",["ngRoute","ngAnimate"]);

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
        .when("/homePage",{
            templateUrl: "views/home/home.htm",
            controller:"HomeController"
        })
        .when("/moreInfo",{
            templateUrl: "views/moreinfo/moreinfo.htm",
            controller:"MoreInfoController"
        })
        .when("/main",{
            templateUrl: "views/main/mainPage.htm",
            controller:"MainController"
        })
        .when("/myProfile",{
            templateUrl: "views/myBooks/myBooks.htm",
            controller:"MyBooksController"
        })
        .otherwise("/login")
        // po definicq mi pokaji
        
})
app.directive('slider', function($timeout) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        images: '='
      },
      link: function(scope, elem, attrs) {
        scope.currentIndex = 0; // Initially the index is at the first image
        
        scope.next = function() {
          scope.currentIndex < scope.images.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;
        };
        
        scope.prev = function() {
          scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.images.length - 1;
        };

        scope.$watch('currentIndex', function() {
            scope.images.forEach(function(image) {
              image.visible = false; // make every image invisible
            });
          
            scope.images[scope.currentIndex].visible = true; // make the current image visible
          });

          // var timer;
          // var sliderFunc = function() {
          //   timer = $timeout(function() {
          //     scope.next();
          //     timer = $timeout(sliderFunc, 5000);
          //   }, 5000);
          // };
          
          // sliderFunc();
          
          // scope.$on('$destroy', function() {
          //   $timeout.cancel(timer); // when the scope is getting destroyed, cancel the timer
          // });
      },
      templateUrl: 'views/allbooks/sliderTemplate.htm'
    };
  });

  app.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
});

  