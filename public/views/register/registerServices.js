var userStorageRegister = (function () {

    function User(firstName, secondName, username, email, password, userImgUrl) {
        if (typeof firstName == "string") {
            Object.defineProperty(this, "firstName", {
                enumerable: true,
                writable: false,
                configurable: false,
                value: firstName
            })
        } else {
            console.log("error first name")
        }
        if (typeof secondName == "string") {
            Object.defineProperty(this, "secondName", {
                enumerable: true,
                writable: false,
                configurable: false,
                value: secondName
            })
        } else {
            console.log("error  name")
        }
        // this.firstName = firstName;
        // this.secondName = secondName;
        if (typeof username == "string") {
            this.username = username;
        } else {
            console.log("error username")
        }

        if (typeof email == "string") {
            this.email = email;
        } else {
            console.log("error ")
        }
        if (typeof password == "string") {
            this.password = password;
        } else {
            console.log("error password")
        }
        if (typeof userImgUrl == "string") {
            this.userImgUrl = userImgUrl;
        } else {
            console.log("error img");
        }
    }

    // cheched fitst and second name for upper case first letter .. 
    function checkToUpperFirstLetter(name) {
        if (name.charAt(0) == name.charAt(0).toUpperCase()) {
            console.log("uppercase first letter");
            return true;
        } else {
            console.log("not uppercase first letter")
            return false;
        }
    }
    // passwrod length is between 5 and 12 char ;
    function testPassword(pass) {
        if (pass.length > 4) {
            if (pass.length < 13) {
                var re = new RegExp("^([a-z0-9]{5,})$");
                if (re.test(pass)) {
                    return true;
                } else {
                    console.log("noooo number")
                }
            } else {
                console.log("password it's too long")
            }
        } else {
            console.log("password it's too short")
        }
    }

    User.prototype.showUser = function (firstName, secondName, username, email, password, userImgUrl) {
            if((typeof firstName == "string") && (firstName.length > 1) && (checkToUpperFirstLetter(firstName)) ){
                if((typeof secondName == "string") && (secondName.length > 3) && (checkToUpperFirstLetter(secondName))){
                    if((typeof username == "string") && (username.length > 5)){
                        if((typeof email == "string") && (email.length > 4) && (email.indexOf('@') > 0)){
                            if((typeof password == "string") &&  (testPassword(password))){
                                if(typeof userImgUrl == "string"){
                                    var user = new User(firstName, secondName, username, email , password, userImgUrl);
                                    return user;
                            } else {
                                console.log("Problem with password - registerServices");
                            }
                            } else {
                                console.log("Problem with password - registerServices");
                            }
                        } else {
                            console.log("Problem with email - registerServices");
                        }
                    } else {
                        console.log("Problem with username - registerServices");
                    }
                } else {
                    console.log("Problem with secondName - registerServices");
                }
            } else {
                console.log("Problem with firstName - registerServices")
            }
    }



    return new User();
})();

