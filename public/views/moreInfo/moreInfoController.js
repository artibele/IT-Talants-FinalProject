

app.controller("MoreInfoController",function($scope, $location , $http){
   
    var params = $location.search(); // return object with id 

    $http.get("/getInfoForAbook/" + params.id).then(function (response) {
        console.log(response.data);
        $scope.book = response.data;
        console.log("here");
    });


    $http.get("/api/loggedIn").then(function (res) {
        console.log(res)

        if (res.data.message == "Logged") {
            $http.get("/getAllBooks").then(function (response) {
                console.log(response.data);
                if (response.status == 200) {
                    $scope.books = response.data;

                }

                
            }).catch(function (err) {
                console.log("noo response")
            })

        } else {
            $location.path('/login');
        }
    });

    $scope.templAboutBook = function () {
        $scope.one = true;
        $scope.two = false;
        $scope.three = false;
    }

    $scope.templAboutAuthor = function () {
        $scope.one = false;
        $scope.two = true;
        $scope.three = false;
    }

    $scope.userComments = function (id) {
        $scope.one = false;
        $scope.two = false;
        $scope.three = true;


        $http.get("/getAllCommentsforBook/" + id).then(function(res){
            // console.log(res.data); // return full object 
            $scope.comments = res.data;
        }).catch(function(err){
            console.log("nqma komentari")
            console.log(err);
        })

    }

    $scope.addComment = function (id){
        var data = {
            text : $scope.userAddComments,
            bookId : id
        }
        // var comment = userStorageMoreInfoForBook.showComment(text,bookId);
       
        $http.post("/inserComments",data).then(function(res){
            console.log(res.data);
            $scope.comments.unshift(res.data);

        }).catch(function(err){
            console.log(err);
        })
    }
})