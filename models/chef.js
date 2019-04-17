var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");


var ChefSchema=new mongoose.Schema({
    username:String,
    password:String,
   
});
ChefSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("Chef",ChefSchema);