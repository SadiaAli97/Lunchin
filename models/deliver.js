var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");


var DeliverSchema=new mongoose.Schema({
    username:String,
    password:String,
    
    pno:String,
    available:String
});
DeliverSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("Deliver",DeliverSchema);