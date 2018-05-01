app.controller("MyBooksController", function ($scope, BookService, $location, $http) {
    BookService.getAllBooks().then(books => {
      $scope.books = books.data;
    })

  });