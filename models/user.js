var mongoose                =require("mongoose"),
    passportLocalMongoose   =require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    username:String,
    password:String
});

UserSchema.plugin(passportLocalMongoose);//it requires bunch of methods that can be used for user authentication...

module.exports=mongoose.model("User  ",UserSchema);
