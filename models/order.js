var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var schema= new Schema({
    
    user:{type:Schema.Types.ObjectId,ref:"User"},
    un:{type:String, required: true},
    cart: {type: Object,required: true},
    address: {type:String, required: true},
    ostatus: {type:String, required: true},
    pincode: {type:String, required: true}
    
});
module.exports=mongoose.model("Order",schema);