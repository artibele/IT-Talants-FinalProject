
app.controller("MoreInfoController",function($scope, $location , $http){
   

    $http.get("/api/loggedIn").then(function (res) {

        if (res.data.message == "Logged") {
            var params = $location.search(); // return object with id 
            
                $http.get("/getInfoForAbook/" + params.id).then(function (response) {
                    $scope.book = response.data;
                    var book = JSON.stringify(response.data)
                    sessionStorage.setItem("book", book);
                });
           
        } else {
            $location.path('/login');
            alert("you musto to be logged .. ")
        }
    });


    $scope.one = true;
    $scope.two = false;
    $scope.three = false;
    $scope.four = false;

    $scope.templAboutBook = function () {
        $scope.one = true;
        $scope.two = false;
        $scope.three = false;
        $scope.four = false;
    }

    $scope.templAboutAuthor = function () {
        $scope.one = false;
        $scope.two = true;
        $scope.three = false;
        $scope.four = false;
    }

    $scope.userComments = function (id) {
        $scope.one = false;
        $scope.two = false;
        $scope.three = true;
        $scope.four = false;


        $http.get("/getAllCommentsforBook/" + id).then(function(res){
            // console.log(res.data); // return full object 
            $scope.comments = res.data.slice().reverse();
        }).catch(function(err){
            console.log("nqma komentari")
            console.log(err);
        })

        $scope.edit = function (comment,commScope){
            var user = JSON.parse(sessionStorage.getItem("user"));
            console.log(comment);
            console.log(user._id);
            console.log(comment.userId._id);

            if(comment.userId._id == user._id){
                commScope.editing = true;
            } else {
                alert("This comment is not yours .. ")
                commScope.editing = false;
            }
        }

        $scope.editComment = function (comment){
            $http.post("/editUserComment", comment)
            .then(function(res){
                var updateCom = res.data; // object

                var indexComm =  $scope.comments.findIndex(function(comm){
                    return comm._id == updateCom._id;
                })
                if(indexComm >= 0){
                    
                    $scope.comments.splice(indexComm, 1 ,updateCom);
                }
            })
            .catch(function(err){
                if(res.status == 401){
                    if(res.data.error == "not your comment"){
                        alert("This comment is not yours to delete!")
                    }else{
                        alert("You need to be logged in to delete a comment!")
                    }
                }
                if(res.status == 500){
                    alert("An error occured , please try again later")
                }
            })
        }

    }


    // $scope.watch("book.price",function(val, old){
    //     $scope.editBookPrice = parseInt(val);
    // })

    $scope.types = [
        {
            type:"romance"
        },
        {
            type:"science"
        },
        {
            type:"history"
        },
        {
            type:"cookbooks"
        },
        {
            type:"fantasy"
        },
        {
            type:"biographies"
        },
        {
            type:"comics"
        },
        {
            type:"travel"
        },
        {
            type:"health"
        },
        {
            type:"drama"
        }
    ]
   
    $scope.editInfoBook = function(book){
        $scope.one = false;
        $scope.two = false;
        $scope.three = false;
        $scope.four = true;

        $scope.editInfoButton = function(book){
            $http.get("/api/loggedIn").then(function(res){
                if(res.data.message == "Logged"){
        
                    var title = book.title;
                    var moreAboutbook = book.moreAboutBook;
                    var author = book.author;
                    var typeBook = book.typeOfBook;
                    var publisher = book.publisher;
                    var published = book.published.toLocaleDateString();
                    var pages = book.pages;
                    var aboutAuthor = book.aboutAuthor;
                    var price = book.price;
                    var linkToBuy = book.linkToBuy;
                    var picture = book.pictureBook;
    
                    var sendBook = userStorageAllBooks.showBook(title,moreAboutbook,author,typeBook,publisher,published,pages,aboutAuthor,price,linkToBuy,picture );
                    if(sendBook == null){
                        $scope.book = "";
                        alert("invalid input");
                        return;
                    }
                    sendBook._id = book._id;

                    $http.post("/editInfoForBook", sendBook).then(function(responseBook){
                        $scope.book = responseBook.data;
                        alert("Update sussesfull") ;
                    })
                }
                
            })

        }

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
})``