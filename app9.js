var express =require("express");
var  app=express();
var   bodyParser =require("body-parser");
var mongoose    =require("mongoose");
var driverarr=new Array();
var g1=new Array();
var g2=new Array();
var g3=new Array();
var dispatched1=new Array();
var Dispatch=require("./models/dispatch");
var Order=require("./models/order");
mongoose.connect("mongodb://localhost:27017/yelp_camp_v6",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
var Driver=require("./models/deliver");
function setSource(){
    // do editor things
    

Driver.find({},"_id",function(err,results){
    for(var i=0;i<results.length;i++){
        var stringifyd = JSON.stringify(results[i]).split(":")[1].substring(1,25).toString();
        driverarr.push(stringifyd);
    }
    
console.log("Drivers");    
console.log(driverarr);
})


Order.find({pincode:560078},"_id",function(err,orders){
        if(err){
            console.log(err)
        };
        for(var i=0;i<orders.length;i++){
        var stringifyd = JSON.stringify(orders[i]).split(":")[1].substring(1,25).toString();
        g1.push(stringifyd);
    }
        
        console.log("g1 is");
        console.log(g1)
        
})

Order.find({pincode:560023},"_id",function(err,orders){
        if(err){
            console.log(err)
        };
          for(var i=0;i<orders.length;i++){
        var stringifyd = JSON.stringify(orders[i]).split(":")[1].substring(1,25).toString();
        g2.push(stringifyd);
    }
        
        console.log("g2 is");
        console.log(g2)
})

Order.find({pincode:560024},"_id",function(err,orders){
        if(err){
            console.log(err)
        };
        for(var i=0;i<orders.length;i++){
        var stringifyd = JSON.stringify(orders[i]).split(":")[1].substring(1,25).toString();
        g3.push(stringifyd);
    }
        console.log("g3 is");
        console.log(g3)
})




}
setSource();
setTimeout(function () {
      //do something, some commands
      
      console.log("hello")
    if(g1.length && driverarr.length){
	    if(g1.length>10){
      dispatched1=g1.slice(0,10);
	    }
	    else{
	        dispatched1=g1
	    }
	    
	  
	    
	   
      
      Order.update({_id:dispatched1},{ostatus:"Dispatched"},{multi:true},function(err,dorders){
          
      })
      
        console.log("Driver is")
       
        var cdriver=driverarr[0]
       driverarr.splice(0,1);
       console.log("Remaining drivers are:");
       console.log(driverarr);
              var newdispatch={orders:g1,driver:cdriver};
              console.log("Newly dispatched order is")
              console.log(newdispatch)
              
             
             Dispatch.create(newdispatch,function(err,newlycreated){
             if(err){
               console.log(err);
             }
            else{
            console.log("Orders to be dispatched are with driver are")
               console.log(newlycreated)
             
        }
    })
    
    }
    
    if(g2.length && driverarr.length){
	    if(g2.length>10){
      dispatched1=g2.slice(0,10);
	    }
	    else{
	        dispatched1=g2
	    }
	    
	  
	    
	   
      
      Order.update({_id:dispatched1},{ostatus:"Dispatched"},{multi:true},function(err,dorders){
          
      })
      
        console.log("Driver is")
       
        var cdriver=driverarr[0]
       driverarr.splice(0,1);
       console.log("Remaining drivers are:");
       console.log(driverarr);
              var newdispatch={orders:g2,driver:cdriver};
              console.log("Newly dispatched order is")
              console.log(newdispatch)
              
             
             Dispatch.create(newdispatch,function(err,newlycreated){
             if(err){
               console.log(err);
             }
            else{
            console.log("Orders to be dispatched are with driver are")
               console.log(newlycreated)
             
        }
    })
    
    }
    
    if(g3.length && driverarr.length){
	    if(g3.length>10){
      dispatched1=g3.slice(0,10);
	    }
	    else{
	        dispatched1=g3
	    }
	    
	  
	    
	   
      
      Order.update({_id:dispatched1},{ostatus:"Dispatched"},{multi:true},function(err,dorders){
          
      })
      
        console.log("Driver is")
       
        var cdriver=driverarr[0]
       driverarr.splice(0,1);
       console.log("Remaining drivers are:");
       console.log(driverarr);
              var newdispatch={orders:g3,driver:cdriver};
              console.log("Newly dispatched order is")
              console.log(newdispatch)
              
             
             Dispatch.create(newdispatch,function(err,newlycreated){
             if(err){
               console.log(err);
             }
            else{
            console.log("Orders to be dispatched are with driver are")
               console.log(newlycreated)
             
        }
    })
    
    }
 }, 3000);



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("App9 is running");
});