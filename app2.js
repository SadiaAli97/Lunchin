var express     =require("express"),
    app         =express(),
    bodyParser  =require("body-parser"),
    
     passport=require("passport"),
     LocalStrategy=require("passport-local"),
     cookieParser = require("cookie-parser"),
    mongoose    =require("mongoose"),
     flash = require("connect-flash"),
    session = require("express-session"),
    MongoStore = require("connect-mongo")(session),
    Cart =require("./models/cart"),
      Order=require("./models/order"),
    Chef=require("./models/chef");//chef
const methodOverride = require('method-override');    
var Dispatch=require("./models/dispatch");
var Driver=require("./models/deliver");
var driverarr= new Array();
var g1 =new Array();
var g2 =new Array();
var g3 = new Array();
var dispatched1= new Array()
var dispatched2= new Array()
var dispatched3= new Array()


//mongoose.connect("mongodb+srv://mansirsetty:mansi4498@cluster0-ulqfu.mongodb.net/yelpcamp?retryWrites=true")
 mongoose.connect("mongodb://localhost:27017/yelp_camp_v6",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(cookieParser());
app.use(methodOverride('_method'));

//passport config
app.use(session({
    secret:"i love myself",
    resave: false,
    saveUninitialized: false
}));
    
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Chef.authenticate()));//user authenticate is already availabe coz of passport local mongoose in user.js we neednt write the whole code
passport.serializeUser(Chef.serializeUser());
passport.deserializeUser(Chef.deserializeUser());

app.use(function(req,res,next){
    
    res.locals.currentChef=req.chef;//chef
    res.locals.session=req.session;
    next();//its very imp so that this middleware will run for every route
});
 
 
var today = new Date()
    var t=today.toLocaleString('en-US', {timeZone: "Asia/Kolkata"})
    //var t=new Date(Date.now()).toLocaleString();
    var time=t[19]
    console.log(time)
    if(t[12]!=":"){
      var str=t[11]+t[12]
      var hours=parseInt(str)
    }
    else{
        var str=t[11]
        var hours=parseInt(str)
    }
    console.log(t)
    console.log(hours)
    
app.get("/",function(req, res){
   res.render("landing2");//landing2 is for chef
});   

var dishSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    vegnveg:String

});
var newdish = mongoose.model("newdish", dishSchema);
app.post("/Currentdishes",function(req,res){
    
    var name=req.body.name;
    var image=req.body.image;
    var price=req.body.price;
    var vegnveg=req.body.vegnveg;
    var dish={name:name,image:image,price:price,vegnveg:vegnveg}
    newdish.create(dish,function(err, newlycreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/Currentdishes")
        }
    });
    
});
app.get("/Currentdishes",function(req,res){
    
    newdish.find({},function(err,alldishes){
        
        if(err){
            console.log(err);
        }
        else{
            res.render("Currentdishes",{newdish:alldishes});
        }
    });
});



//show the dish to be deleted
app.get("/Currentdishes/:id",function(req,res){
   newdish.findById(req.params.id,function(err,foundDish){
       if(err){
           console.log(err);
       }else{
           console.log(foundDish);
           res.render("deletedish",{newdish:foundDish});
           
       }
       
   });
});

//delete a dsih
app.delete("/Currentdishes/:id",function(req,res){
    newdish.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/Currentdishes");
           console.log(err);
        }else{
           res.redirect("/Currentdishes");
       }
    });
   
});


app.get("/adddish",function(req,res){
    res.render("adddish")
});
app.get("/chefp",function(req, res) {   //chef preparing
    //Order.update({},{ostatus:"Preparing"})
    
    //Order.update({}, { $set: { ostatus: "Preparing"}})
    Order.find({},function(err,orders){
        if(err){
            return res.write("Error");
        };
        
        var cart;
        orders.forEach(function(order){
            cart=new Cart(order.cart);
            order.items=cart.generateArray();
        });
      Order.update({}, { ostatus: "Preparing"}, {multi : true}, function(err,order){
          if(err){
              console.log(err)
          }
          console.log("orders prepared are:")
          console.log(order)
      }) 
    
        res.render("chefp",{orders:orders,hours:hours});
    })
})
app.get("/changestatus",function(req,res){
 
  Order.find({},function(err,orders){
        if(err){
            return res.write("Error");
        };
        
        var cart;
        orders.forEach(function(order){
            cart=new Cart(order.cart);
            order.items=cart.generateArray();
        });
      
      setTimeout(function(){
         console.log("chnage deployed")

    finddriver()
    setTimeout(setSource, 2000);
    setTimeout(startalgo, 3000);
    //startalgo()
    
    }, 3000);
        res.render("changestatus",{orders:orders,hours:hours});
  });
});
app.get("/Currentdishes",function(req,res){
    res.render("Currentdishes")
})


app.get("/partner",function(req,res){
    res.render("partner");
});



//chef login
app.get("/loginchef",function(req,res){
    res.render("loginchef");
});

app.post("/loginchef",passport.authenticate("local",{
    successRedirect: "/integrate",
    failureRedirect: "/loginchef"
}),function(req,res){
    
});
app.get("/logoutchef",function(req,res){
    req.logout();
    res.redirect("/partner");
});

//signup for chef

app.get("/integrate",function(req,res){
    res.render("integrate");
})

app.get("/dispatch",function(req,res){
    res.render("dispatch");
})

app.post("/dispatch",function(req,res){
    
})

app.get("/chef",function(req,res){
    res.render("chef");
})

app.get("/signupchef",function(req, res) {
    res.render("signupchef");
});
app.post("/signupchef",function(req,res){
    var newChef = new Chef({
        username: req.body.username,
        
    });
    
    
   Chef.register(newChef, req.body.password,function(err,chef){//only create object for username not for password as only to store username in database
   if(err){
       console.log(err);
       return res.render("signupchef");
    }
    console.log(chef);
       passport.authenticate("local")(req,res,function(){
          res.redirect("/integrate");
       });
   });
});

function finddriver()
{
console.log("Hello")
Driver.find({available:"true"},"_id",function(err,results){
    console.log("drivers in app2 are")
    console.log(results)
    for(var i=0;i<results.length;i++){
        var stringifyd = JSON.stringify(results[i]).split(":")[1].substring(1,25).toString();
        driverarr.push(stringifyd);
    }
    
console.log("Drivers");    
console.log(driverarr);
})
}
function setSource(){
Order.find({pincode:560078},"_id",{ limit: 10},function(err,orders){
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

Order.find({pincode:560023},"_id",{ limit: 10},function(err,orders){
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

Order.find({pincode:560100},"_id",{ limit: 10},function(err,orders){
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

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("lunch in app started");
});
