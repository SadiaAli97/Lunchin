var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");


var UserSchema=new mongoose.Schema({
    username:String,
    password:String,
    pno:String,
    email:String,
    ad1:String,
    ad2:String,
    pin:String
    
});
UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",UserSchema);