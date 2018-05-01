app.service("BookService",function ($http) {
    this.getAllBooks = () => $http.get("https://restcountries.eu/rest/v2/all")
});