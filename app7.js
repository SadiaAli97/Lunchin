//retrieving all orders that are prepared

var express =require("express");
var  app=express();
var   bodyParser =require("body-parser");
var mongoose    =require("mongoose");
var newdispatch;
mongoose.connect("mongodb://localhost:27017/yelp_camp_v6",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
var Dispatch=require("./models/dispatch");
var Order=require("./models/order");
var Driver=require("./models/deliver");
var Cart =require("./models/cart");
var User=require("./models/user");
var addrress=new Array()
var orders= new Array();
var driverarr= new Array();
var g1 =new Array();
var g2 =new Array();
var g3 = new Array();
var g1old=new Array();
var g2old=new Array();
var g3old=new Array();
var dispatched1= new Array()
var dispatched2= new Array()
var dispatched3= new Array()
var passport=require("passport");
var LocalStrategy=require("passport-local");
var session = require("express-session");
//var Assgn=require("./models/assign")

app.use(session({
    secret:"i love myself",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Driver.authenticate()));//deliver authenticate is already availabe coz of passport local mongoose in deliver.js we neednt write the whole code
passport.serializeUser(Driver.serializeUser());
passport.deserializeUser(Driver.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentDeliver=req.user;
    //res.locals.currentChef=req.chef;//chef
    res.locals.session=req.session;
    next();//its very imp so that this middleware will run for every route
});


function finddriver()
{
console.log("Hello")
Driver.find({available:"true"},"_id",function(err,results){
    for(var i=0;i<results.length;i++){
        var stringifyd = JSON.stringify(results[i]).split(":")[1].substring(1,25).toString();
        driverarr.push(stringifyd);
    }
    
console.log("Drivers");    
console.log(driverarr);
})
}
function setSource(){
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

Order.find({pincode:560100},"_id",function(err,orders){
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
finddriver()
setSource();

function startalgo() {
      //do something, some commands
    console.log("driver in algo is")
    console.log(driverarr)
      
    if(g1.length && driverarr.length){
	    if(g1.length>10){
      dispatched1=g1.slice(0,10);
      if(g1.length){
      g1=g1.slice(10);
      }
	    }
	    else{
	        dispatched1=g1
	        g1old=dispatched1;
	        g1=[]
	    }
	   console.log("in algo g1")
      console.log(g1)
      console.log("dispatched in algo")
      console.log(dispatched1)
      Order.update({_id:dispatched1},{ostatus:"Dispatched"},{multi:true},function(err,dorders){
          
      })
      
        console.log("Driver is")
       
        var cdriver=driverarr[0]
       driverarr.splice(0,1);
       console.log("Remaining drivers are:");
       console.log(driverarr);
              var newdispatch={orders:dispatched1,driver:cdriver};
              console.log("Newly dispatched order is")
              console.log(newdispatch)
              
             Driver.update({_id:cdriver},{available:"false"},function(err,dorders){
          
      })
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
      if(g2.length){
      g2=g2.slice(10);
      }
	    }
	    else{
	        dispatched1=g2
	        g2old=dispatched1;
	        g2=[]
	    }
	    
	  
	    
	   
      
      Order.update({_id:dispatched1},{ostatus:"Dispatched"},{multi:true},function(err,dorders){
          
      })
      
        console.log("Driver is")
       
        var cdriver=driverarr[0]
       driverarr.splice(0,1);
       console.log("Remaining drivers are:");
       console.log(driverarr);
              var newdispatch={orders:dispatched1,driver:cdriver};
              console.log("Newly dispatched order is")
              console.log(newdispatch)
                  Driver.update({_id:cdriver},{available:"false"},function(err,dorders){
          
      }) 
             
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
      if(g3.length){
      g3=g3.slice(10);
      }
	    }
	    else{
	        dispatched1=g3
	        g3old=dispatched1;
	        g3=[]
	    }
	    
	  
	    
	   
      
      Order.update({_id:dispatched1},{ostatus:"Dispatched"},{multi:true},function(err,dorders){
          
      })
      
        console.log("Driver is")
       
        var cdriver=driverarr[0]
       driverarr.splice(0,1);
       console.log("Remaining drivers are:");
       console.log(driverarr);
              var newdispatch={orders:dispatched1,driver:cdriver};
              console.log("Newly dispatched order is")
              console.log(newdispatch)
              
                  Driver.update({_id:cdriver},{available:"false"},function(err,dorders){
          
      })
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
 }

//setTimeout(startalgo, 3000);

app.get("/homepage2",function(req, res){
   res.render("homepage2");
});

app.get("/",function(req, res){
   res.render("landing3");
});
/*app.get("/chkorders",function(req,res){
    res.render("chkorders");
});*/

app.get("/dispatch",function(req,res){
  
    console.log("User is")
    console.log(req.user._id)
    Dispatch.find({driver:req.user._id},"orders",function(err,results){
        if(results.length==0){
            var orders={}
            res.render("dispatch",{orders:orders});
        }
        else{
       var n=results.length;
        var tmp=results[n-1].orders
        var stringifyd = tmp.split(",");
        
       Order.find({_id:stringifyd},"address",function(err,addresses){
     
           for(var i=0;i<addresses.length;i++){
               var etee=JSON.stringify(addresses[i]).split(":")[2]
        var ete = etee.substring(1,(etee.length-2)).toString();
        addrress.push(ete);
    }
    console.log("addresses are")
    console.log(addrress)
           
       })
      
        Order.find({_id:stringifyd},function(err,orders){
        if(err){
            return res.write("Error");
        };
        console.log("dispatch orders are")
        console.log(orders)
        var cart;
       
    
        orders.forEach(function(order){
            cart=new Cart(order.cart);
            order.items=cart.generateArray();
        });
        
            console.log("orders are")
            console.log(orders)
            res.render("dispatch",{orders:orders});
    
       
       
    })
        } 
        
    })
})

app.get("/deliver",function(req,res){
    res.render("deliver");
});

app.get("/logoutdeliver",function(req,res){
    req.logout();
    res.redirect("/deliver");
});

//login for delivery boy
app.get("/deli_login",function(req,res){
    res.render("deli_login");
});

app.post("/deli_login",passport.authenticate("local",{
    successRedirect: "/chkorders",
    failureRedirect: "/deli_login"
}),function(req,res){
    
});
app.get("/logoutdeliver",function(req,res){
    req.logout();
    res.redirect("/deliver");
});

//signup for delivery boy
app.get("/deliregister",function(req, res) {
    res.render("deliregister");
});

app.post("/deliregister",function(req,res){
    var newDeliver = new Driver({
        username: req.body.username,
        pno: req.body.pno,
        available:"true"
        
    });
    
   Driver.register(newDeliver, req.body.password,function(err,deliver){//only crneate object for username not for password as only to store username in database
   if(err){
       console.log(err);
       return res.render("deliregister");
    }
    console.log(deliver);
       passport.authenticate("local")(req,res,function(){
           res.redirect("/homepage2");
       });
   });
});


app.get("/chkorders",function(req,res){
    res.render("chkorders")
})


app.post("/chkorders",function(req,res){
    startalgo();
    res.redirect("/dispatch");
})

app.get("/navi",function(req,res){
    var y;
    function boo()
{
var x=["DSCE,bengaluru,India"]
var l=x.concat(addrress);
y="https://www.google.com/maps/dir/?api=1&origin="+l[0]+"&destination="+l[0]+"&travelmode=driving&waypoints="+l[1];
 if(l.length>=2){
		for(var i=2;i<l.length;i++){
					y=y+"%7C"+l[i];
		}
}


}
boo();
    res.redirect(y);
});

app.post("/navicomplete",function(req,res){
    Driver.update({_id:req.user._id},{available:"true"},function(err,dorders){
          
      })
    /*Dispatch.deleteOne({driver:req.user._id},function(err,orders){
        console.log(orders)
    })*/
    Dispatch.find({driver:req.user._id},"orders",function(err, ress) {
        
        var tmp1=JSON.stringify(ress).split(":")
        console.log("orders to be deleted are")
        console.log(ress)
        Order.findByIdAndRemove({_id:ress},function(err){
       if(err){
          
           console.log(err);
        }else{
           console.log("deleted orders")
       }
    });
    })
    
    Dispatch.find({driver:req.user._id},"_id",function(err, ress) {
        Dispatch.findOneAndRemove({_id: ress}, function(err,data){
        console.log("deleted")
        console.log(data)
    if(!err){
        console.log("Deleted");
    }
    
})
    })
    setTimeout(function(){
    console.log("g1 is")
    console.log(g1)
    finddriver()
    setTimeout(startalgo, 4000);
    //startalgo()
    setTimeout(function(){ res.redirect("/dispatch"); }, 4000);
    }, 3000);
})

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("its swiggy bitches");
});