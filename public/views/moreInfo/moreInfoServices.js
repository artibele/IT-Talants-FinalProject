var  userStorageMoreInfoForBook = (function(){

    function Comment (text,bookId, userId ,datePostComm){
        if((typeof text == "string") &&  (text.length > 2) ){
            this.text = text;
        } else {
            console.log("error comment")
        }
        if(typeof bookId == "string"){
            this.bookId = bookId;
        } else {
            console.log("error book id")
        }
        if(typeof userId == "string"){
            this.userId = userId;
        } else {
            console.log("error user id")
        }
        if(typeof datePostComm == "string"){
            this.datePostComm = datePostComm;
        } else {
            console.log(" error date")
        }
    }

    Comment.prototype.showComment = function (text,bookId, userId ,datePostComm){
        if((typeof text == "string") &&  (text.length > 2)){
            if(typeof bookId == "string"){
                if(typeof userId == "string"){
                    if(typeof datePostComm == "string"){
                        var userComment = new Comment(text,bookId, userId ,datePostComm);
                        return userComment;
                    } else {
                        console.log("invalid date")
                    }
                } else {
                    console.log("invalid user id")
                }
            } else {
                console.log('invalid book id')
            }
        } else {
            console.log("invalid text")
        }

    }

    return new Comment();
})();