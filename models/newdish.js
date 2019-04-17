

var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var schema= new Schema({
    name: String,
    image: String,
    price: String

   
    
});

module.exports=mongoose.model("Order",schema);