
app.controller("MoreInfoController",function($scope, $location , $http){
   
    var params = $location.search(); // return object with id 

    $http.get("/getInfoForAbook/" + params.id).then(function (response) {
        $scope.book = response.data;
        var book = JSON.stringify(response.data)
        sessionStorage.setItem("book", book);
    });

    $http.get("/api/loggedIn").then(function (res) {

        if (res.data.message == "Logged") {
           
        } else {
            $location.path('/login');
            alert("you musto to be logged .. ")
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
            $scope.comments = res.data.slice().reverse();
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
            $scope.userAddComments = "";

        }).catch(function(res){
            if(res.status == 401){
               alert("You neeet to be logged")
            }            
            if(res.status == 500){
                alert("An error occured , please try again later")
            }
        })
    }

    $scope.deleteComment = function (id){
        $http.delete("/deleteComment/" + id).then(function(res){
            var index = $scope.comments.findIndex(function(comment){
                return comment._id == id;
            })
            if(index >= 0){
                $scope.comments.splice(index,1);
            } else {
                console.log("nooo comment")
            }
        }).catch(function(res){
            if(res.status == 401){
                if(res.data.error == "not your comment"){
                    alert("This comment is not yours to delete!")
                }else{
                    alert("You need to be logged in to delete a comment!")
                }
            }
            if(res.status == 404){
                alert("comment was not found")
            }
            if(res.status == 500){
                alert("An error occured , please try again later")
            }
        })
    }
})