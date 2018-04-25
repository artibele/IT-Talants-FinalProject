var  userStorageAllBooks = (function(){
    function Book(title , descrioptions, bookImgURl){
        if((typeof title == "string") && (title.length > 2)){
            this.title = title;
        } else {
            console.log("error with title book");
        }
        if((typeof descrioptions == "string") && (descrioptions.length > 5) ){
            this.descrioptions = descrioptions;
        } else {
            console.log("error with book descriptions .. ")
        }

    }
})();