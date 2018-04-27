var  userStorageAllBooks = (function(){
    
        function Book(title , moreAboutBook, author,typeOfBook , publisher ,published,pages,aboutAuthor,price, linkToBuy,pictureImg){
            
            function isValidDate(date) {
                var temp = date.split('/');
                var d = new Date(temp[2] + '/' + temp[0] + '/' + temp[1]);
                return (d && (d.getMonth() + 1) == temp[0] && d.getDate() == Number(temp[1]) && d.getFullYear() == Number(temp[2]));
            }
    
            if((typeof title == "string") && (title.length > 2)){
                this.title = title;
            } else {
                console.log("Error title")
            }
            if((typeof moreAboutBook == "string") && (moreAboutBook.length > 2)){
                this.moreAboutBook = moreAboutBook;
            } else {
                console.log("error more about book")
            }
            if((typeof author == "string") && (author.length > 2)){
                this.author = author;
            } else {
                console.log("error author name")
            }
            if((typeof typeOfBook == 'string') && (typeOfBook.length >2)){
                this.typeOfBook = typeOfBook;
            } else {
                console.log("error type of book");
            }
            if((typeof publisher == "string")){
                this.publisher = publisher;
            } else {
                console.log("error publishes")
            }
            if((typeof published == "string")){
                this.published = published;
            } else {
                console.log("error published")
            }
            if((typeof pages == "number") && (pages > 0)){
                this.pages = pages;
            } else {
                console.log("error pages")
            }
            if((typeof aboutAuthor == "string") && (aboutAuthor.length > 2)){
                this.aboutAuthor = aboutAuthor;
            } else {
                console.log("error about author")
            }
            if((typeof price == "number") && (price > 0)){
                this.price = price;
            } else {
                console.log("error price")
            }
            if((typeof linkToBuy == "string") && (linkToBuy.length > 3)){
                this.linkToBuy = linkToBuy;
            } else {
                console.log("error link buy ")
            }
            if((typeof pictureImg == "string") && (pictureImg.length > 3)){
                this.pictureImg = pictureImg;
            } else {
                console.log("error picture url")
            }
        }
    
        Book.prototype.showBook = function (title , moreAboutBook, author,typeOfBook , publisher ,published,pages,aboutAuthor,price, linkToBuy,pictureImg) {
            if((typeof title == "string") && (title.length > 2)){
                if((typeof moreAboutBook == "string") && (moreAboutBook.length > 2)){
                    if((typeof author == "string") && (author.length > 2)){
                        if((typeof typeOfBook == 'string') && (typeOfBook.length >2)){
                            if((typeof publisher == "string")){
                                if((typeof published == "string")){
                                    if((typeof pages == "number") && (pages > 0)){
                                        if((typeof aboutAuthor == "string") && (aboutAuthor.length > 2)){
                                            if((typeof price == "number") && (price > 0)){
                                                if((typeof linkToBuy == "string") && (linkToBuy.length > 3)){
                                                    if((typeof pictureImg == "string") && (pictureImg.length > 3)){
                                                        var book = new Book(title , moreAboutBook, author,typeOfBook , publisher ,published,pages,aboutAuthor,price, linkToBuy,pictureImg);
                                                        return book;
                                                        
                                                    } else {
                                                        console.log("not a link")
                                                    }
                                                } else {
                                                    console.log("not a link")
                                                }
                                            } else {
                                                console.log("not a price")
                                            }
                                        } else {
                                            console.log("not info for author")
                                        }
                                    } else {
                                        console.log("not pages")
                                    }
                                } else { 
                                    console.log("not a publisher")
                                }
                            } else {
                                console.log("not a publisher")
                            }
                        } else {
                            console.log("not type of book")
                        }
                    } else {
                        console.log("not a author")
                    }
                } else {
                    console.log("not a info for book")
                }
            } else {
                console.log("not a title")
            }
           var book = new Book(title , moreAboutBook, author,typeOfBook , publisher ,published,pages,aboutAuthor,price, linkToBuy,pictureImg);
                return book;
        }

    
        return new Book();
    })();