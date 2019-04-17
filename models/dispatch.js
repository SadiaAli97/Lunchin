var mongoose=require("mongoose");
var Schema=mongoose.Schema;
var dschema= new Schema({
    
  
    
    orders:String,
    
    driver:String
    
});
module.exports=mongoose.model("Dispatched",dschema);