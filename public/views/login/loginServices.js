var  userStorageLogin = (function(){

    function User (username , password){
        if(typeof username == "string"){
            this.username = username;
        } else {
            console.log("error username");
        }
        if(typeof password == "string"){
            this.password = password;
        } else {
            console.log("error password");
        }
    }

    function testPassword (pass){
        if(pass.length > 4){
            if(pass.length < 13){
                var re = new RegExp("^([a-z0-9]{5,})$");
                if(re.test(pass)){
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

    User.prototype.showLogedUser = function (username , password) {
        if((typeof username == "string") && (username.length > 5)){
            if((typeof password == "string") && (testPassword(password))){
                var userLog = new User(username , password);
                return userLog;
            } else {
                console.log("Problem with password - loginServices");
            }
        } else {
            console.log("Problem with username - loginServices");
        }
    }
    return new User();
})();