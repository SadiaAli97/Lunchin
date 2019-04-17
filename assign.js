var Dispatch=require("./models/dispatch");
var orders= new Array();
var avail_drivers= new Array();
var g1 =new Array();
var g2 =new Array();
var g3 = new Array();
var dispatched1= new Array()
var dispatched2= new Array()
var dispatched3= new Array()

var Order=require("./models/order");
var Driver=require("./models/deliver");
module.exports=function init(){
Order.find({},function(err,orders){
        if(err){
           console.log(err)
        };
        
        var cart;
        orders.forEach(function(order){
            cart=new Cart(order.cart);
            order.items=cart.generateArray();
        }); 
        
        orders=orders;
        console.log("Orders are:")
        console.log(orders)
    })
//retrieve all the drivers
Driver.find({},"_id",function(err,drivers){
        if(err){
            console.log(err)
        };
          
          
          avail_drivers=drivers;
          console.log('Drivers are:');
          console.log(avail_drivers)
        
        }); 
        
    
   
//group orders by pincode
Order.find({pincode:560078},"_id",function(err,orders){
        if(err){
            console.log(err)
        };
        
        /*var cart;
        orders.forEach(function(order){
            cart=new Cart(order.cart);
            order.items=cart.generateArray();
        }); */
        
        g1=orders;
        console.log("Pincode1 is:")
        console.log(g1)
    })

Order.find({pincode:560023},"_id",function(err,orders){
        if(err){
            console.log(err)
        };
        
        /*var cart;
        orders.forEach(function(order){
            cart=new Cart(order.cart);
            order.items=cart.generateArray();
        }); 
        */
        g2=orders;
        console.log("Pincode2 is:")
        console.log(g2)
    })



Order.find({pincode:560024},"_id",function(err,orders){
        if(err){
            console.log(err)
        };
        
        /*var cart;
        orders.forEach(function(order){
            cart=new Cart(order.cart);
            order.items=cart.generateArray();
        }); */
        
       
        
        g3=orders;
        console.log("Pincode 3 is")
        console.log(g3)
    })

console.log("G1")
console.log(g1.length)
console.log("avail_drivers")
console.log(avail_drivers.length)
console.log("G2")
console.log(g2.length)
console.log("G3")
console.log(g3.length)

}
module.exports=function assign(){
if(g1.length && avail_drivers.length){
        //console.log("hello")
	    if(g1.length>10){
      dispatched1=g1.slice(0,10);
	    }
	    else{
	        dispatched1=g1
	    }
	    
	    //convert to objectid
	    var dispatched11=new Array()
	    for(var i=0;i<dispatched1.length;i++){
	        //console.log("i is")
	        //console.log(dispatched1[i])
	        //var id=mongoose.Types.ObjectId(dispatched1[i])
	        dispatched11.push(dispatched1[i])
	        console.log("Object i is")
	        console.log(dispatched11)
	    }
	    console.log("Object ids are:")
	    console.log(dispatched11)
      //update order status
      /*
      Order.update({_id:dispatched11}, { ostatus: "Dispatched"}, function(err,order){
          if(err){
              console.log(err)
          }
      }) */
      
      Order.update({_id:dispatched11},{ostatus:"Dispatched"},{multi:true},function(err,dorders){
          console.log("id orders")
          console.log(dorders)
      })
      
      

      //create a new order for the dispatched orders
     Order.find({_id:dispatched11},"_id",function(err,orders){
        if(err){
            console.log(err)
        };
        /*var cart;
        orders.forEach(function(order){
            cart=new Cart(order.cart);
            order.items=cart.generateArray();
            console.log("Orders to be dispatched are")
            console.log(orders)
        });
        */
        
        //var stringify = JSON.stringify(orders);
        //console.log(stringify)
        
        //console.log(new_strs)
        var ordersarray=new Array();
        for(var i = 0; i < orders.length; i++)
        {   
            //console.log("stringifys")
            var stringify = JSON.stringify(orders[i]).split(":")[1].substring(1,25).toString();
            ordersarray.push(stringify)
            //console.log("Orders array is")
            //console.log(ordersarray);
            //console.log(new_strs);
            
          }
          console.log("Object array is")
          console.log(ordersarray)
          let objectIdArray = ordersarray.map(s => mongoose.Types.ObjectId(s));
          //console.log(objectIdArray)
        
        //find a driver
        console.log("Driver is")
        var cdriver=avail_drivers[0]
        Driver.find({_id:cdriver},"_id",function(err,driver){
             //create new dispatch
             //console.log(driver)
             //var driverarr;
             var stringifyd = JSON.stringify(driver).split(":")[1].substring(1,25).toString();
             console.log("Driver is")
             console.log(stringifyd)
              var newdispatch={orders:ordersarray,driver:stringifyd};
              console.log("Newly dispatched order is")
              console.log(newdispatch)
              
             avail_drivers.splice(0,1);
             console.log(avail_drivers)
             
             Dispatch.create(newdispatch,function(err,newlycreated){
             if(err){
               console.log(err);
             }
            else{
            console.log("Orders to be dispatched are with driver are")
               console.log(newlycreated)
               //res.redirect("dispatch");
        }
    })
    
        })
  
      })

	}

//PINCODE 2

  if(g2.length && avail_drivers.length){
        //console.log("hello")
	    if(g2.length>10){
      dispatched1=g2.slice(0,10);
	    }
	    else{
	        dispatched1=g2
	    }
	    
	    //convert to objectid
	    var dispatched11=new Array()
	    for(var i=0;i<dispatched1.length;i++){
	        //console.log("i is")
	        //console.log(dispatched1[i])
	        //var id=mongoose.Types.ObjectId(dispatched1[i])
	        dispatched11.push(dispatched1[i])
	        console.log("Object i is")
	        console.log(dispatched11)
	    }
	    console.log("Object ids are:")
	    console.log(dispatched11)
      //update order status
      /*
      Order.update({_id:dispatched11}, { ostatus: "Dispatched"}, function(err,order){
          if(err){
              console.log(err)
          }
      }) */
      
      Order.update({_id:dispatched11},{ostatus:"Dispatched"},{multi:true},function(err,dorders){
          console.log("id orders")
          console.log(dorders)
      })
      
      

      //create a new order for the dispatched orders
     Order.find({_id:dispatched11},"_id",function(err,orders){
        if(err){
            console.log(err)
        };
        /*var cart;
        orders.forEach(function(order){
            cart=new Cart(order.cart);
            order.items=cart.generateArray();
            console.log("Orders to be dispatched are")
            console.log(orders)
        });
        */
        
        //var stringify = JSON.stringify(orders);
        //console.log(stringify)
        
        //console.log(new_strs)
        var ordersarray=new Array();
        for(var i = 0; i < orders.length; i++)
        {   
            //console.log("stringifys")
            var stringify = JSON.stringify(orders[i]).split(":")[1].substring(1,25).toString();
            ordersarray.push(stringify)
            //console.log("Orders array is")
            //console.log(ordersarray);
            //console.log(new_strs);
            
          }
          console.log("Object array is")
          console.log(ordersarray)
          let objectIdArray = ordersarray.map(s => mongoose.Types.ObjectId(s));
          //console.log(objectIdArray)
        
        //find a driver
        console.log("Driver is")
        var cdriver=avail_drivers[0]
        Driver.find({_id:cdriver},"_id",function(err,driver){
             //create new dispatch
             //console.log(driver)
             //var driverarr;
             var stringifyd = JSON.stringify(driver).split(":")[1].substring(1,25).toString();
             console.log("Driver is")
             console.log(stringifyd)
              var newdispatch={orders:ordersarray,driver:stringifyd};
              console.log("Newly dispatched order is")
              console.log(newdispatch)
              
             avail_drivers.splice(0,1);
             console.log(avail_drivers)
             
             Dispatch.create(newdispatch,function(err,newlycreated){
             if(err){
               console.log(err);
             }
            else{
            console.log("Orders to be dispatched are with driver are")
               console.log(newlycreated)
               //res.redirect("dispatch");
        }
    })
    
        })
  
      })

	}


//PINCODE 3

  if(g3.length && avail_drivers.length){
        //console.log("hello")
	    if(g3.length>10){
      dispatched1=g3.slice(0,10);
	    }
	    else{
	        dispatched1=g3
	    }
	    
	    //convert to objectid
	    var dispatched11=new Array()
	    for(var i=0;i<dispatched1.length;i++){
	        //console.log("i is")
	        //console.log(dispatched1[i])
	        //var id=mongoose.Types.ObjectId(dispatched1[i])
	        dispatched11.push(dispatched1[i])
	        console.log("Object i is")
	        console.log(dispatched11)
	    }
	    console.log("Object ids are:")
	    console.log(dispatched11)
      //update order status
      /*
      Order.update({_id:dispatched11}, { ostatus: "Dispatched"}, function(err,order){
          if(err){
              console.log(err)
          }
      }) */
      
      Order.update({_id:dispatched11},{ostatus:"Dispatched"},{multi:true},function(err,dorders){
          console.log("id orders")
          console.log(dorders)
      })
      
      

      //create a new order for the dispatched orders
     Order.find({_id:dispatched11},"_id",function(err,orders){
        if(err){
            console.log(err)
        };
        /*var cart;
        orders.forEach(function(order){
            cart=new Cart(order.cart);
            order.items=cart.generateArray();
            console.log("Orders to be dispatched are")
            console.log(orders)
        });
        */
        
        //var stringify = JSON.stringify(orders);
        //console.log(stringify)
        
        //console.log(new_strs)
        var ordersarray=new Array();
        for(var i = 0; i < orders.length; i++)
        {   
            //console.log("stringifys")
            var stringify = JSON.stringify(orders[i]).split(":")[1].substring(1,25).toString();
            ordersarray.push(stringify)
            //console.log("Orders array is")
            //console.log(ordersarray);
            //console.log(new_strs);
            
          }
          console.log("Object array is")
          console.log(ordersarray)
          let objectIdArray = ordersarray.map(s => mongoose.Types.ObjectId(s));
          //console.log(objectIdArray)
        
        //find a driver
        console.log("Driver is")
        var cdriver=avail_drivers[0]
        Driver.find({_id:cdriver},"_id",function(err,driver){
             //create new dispatch
             //console.log(driver)
             //var driverarr;
             var stringifyd = JSON.stringify(driver).split(":")[1].substring(1,25).toString();
             console.log("Driver is")
             console.log(stringifyd)
              var newdispatch={orders:ordersarray,driver:stringifyd};
              console.log("Newly dispatched order is")
              console.log(newdispatch)
              
             avail_drivers.splice(0,1);
             console.log(avail_drivers)
             
             Dispatch.create(newdispatch,function(err,newlycreated){
             if(err){
               console.log(err);
             }
            else{
            console.log("Orders to be dispatched are with driver are")
               console.log(newlycreated)
               //res.redirect("dispatch");
        }
    })
    
        })
  
      })

	}
}