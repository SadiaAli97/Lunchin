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
    Chef=require("./models/chef"),//chef
     User=require("./models/user"),
     Order=require("./models/order");   
   
  
    
mongoose.connect("mongodb://localhost:27017/yelp_camp_v6",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(cookieParser());

//PASSPORT CONFIG
app.use(session({
    secret:"i love myself",
    resave: false,
    saveUninitialized: false,
    store:new MongoStore({mongooseConnection:mongoose.connection}),
    cookie: {maxAge:180*60*1000}
    
    
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//user authenticate is already availabe coz of passport local mongoose in user.js we neednt write the whole code
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/*passport.use(new LocalStrategy(Chef.authenticate()));//user authenticate is already availabe coz of passport local mongoose in user.js we neednt write the whole code
passport.serializeUser(Chef.serializeUser());
passport.deserializeUser(Chef.deserializeUser());*/


app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    //res.locals.currentChef=req.chef;//chef
    res.locals.session=req.session;
    next();//its very imp so that this middleware will run for every route
});





app.get("/",function(req, res){
   res.render("landing");
});
app.get("/cust_mainpage",function(req,res){
    
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
    
    newdish.find({},function(err,alldishes){
        
        if(err){
            console.log(err);
        }
        else{
            res.render("cust_mainpage",{newdish:alldishes,hours:hours,time:time});
        }
    });
});
var dishSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String

});
var newdish = mongoose.model("newdish", dishSchema);
app.post("/Currentdishes",function(req,res){
    
    var name=req.body.name;
    var image=req.body.image;
    var price=req.body.price;
    var dish={name:name,image:image,price:price}
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


app.get("/add-to-cart/:id", function(req, res){
    var productId=req.params.id;

    var cart=new Cart(req.session.cart ? req.session.cart :{});
    
    newdish.findById(productId, function(err, product){
        if(err){
            return res.redirect("/cust_mainpage");
        }
        cart.add(product,product.id);
        req.session.cart=cart;
        console.log(req.session.cart);
        res.redirect("cust_mainpage");
        
        
        
    });
    
});

app.get("/addone/:id",function(req, res) {
    var productId=req.params.id;
    var cart=new Cart(req.session.cart ? req.session.cart :{});
    
    newdish.findById(productId, function(err, product){
       if(err){
           console.log(err)
       }
        cart.add(product,product.id);
        req.session.cart=cart;
        console.log(req.session.cart);
        res.redirect("/cart");
    });
        
})

app.get("/reduce/:id",function(req,res){
    var productId=req.params.id;
    var cart=new Cart(req.session.cart ? req.session.cart :{});
    console.log(req.session.cart);
    cart.reducebyone(productId);
    req.session.cart=cart;
    res.redirect("/cart");
});

app.get("/remove/:id",function(req,res){
    var productId=req.params.id;
    var cart=new Cart(req.session.cart ? req.session.cart :{});
    cart.removeitem(productId);
    req.session.cart=cart;
    res.redirect("/cart");
});

app.get("/cart",function(req,res){
    if(!req.session.cart){
        console.log("wrong")
        return res.render("cart",{products:null})
    }
    var cart =new Cart(req.session.cart);
    res.render("cart",{products:cart.generateArray(),totalPrice:cart.totalPrice})
});





app.get("/adddish",function(req,res){
    res.render("adddish")
});



//    
// //AUTH ROUTES
////show signup form
app.get("/register",function(req, res) {
    res.render("register");
});

//handling user signup//
app.post("/register",function(req,res){
    var newUser = new User({
        username: req.body.username,
        pno: req.body.pno,
        email: req.body.email,
        ad1: req.body.ad1,
        ad2: req.body.ad2,
        pin: req.body.pin
    });
    //var newEmail = req.body.email;
    //var newAd1 =req.body.ad1;
    //var newAd2 =  req.body.ad2;
    //var newPin = req.body.pin;
   User.register(newUser, req.body.password,function(err,user){//only create object for username not for password as only to store username in database
   if(err){
       console.log(err);
       return res.render("register");
    }
    console.log(user);
       passport.authenticate("local")(req,res,function(){
           res.redirect("/cust_mainpage");
       });
   });
});


app.post("/editpro",function(req,res){
    var username= req.body.username,
        pno= req.body.pno,
        email= req.body.email,
        ad1= req.body.ad1,
        ad2= req.body.ad2,
        pin= req.body.pin;
    
    User.update({_id:req.user},{username:username,
        pno:pno,email:email,
        ad1:ad1,ad2:ad2,pin:pin}
        
        ,function(err,rest){
          console.log(err);
          res.render("profile");
        });
    });

        

//LOGIN ROUTES
//render login form
app.get("/login",function(req,res){
    res.render("login");
});
//login logic
//middleware
app.post("/login",passport.authenticate("local",{
    failureRedirect: "/login"
}),function(req,res,next){
    if(req.session.oldUrl){
       var oldUrl=req.session.oldUrl;
        req.session.oldUrl=null;
        res.redirect(oldUrl);
    }
    else{
        res.redirect("cust_mainpage");
    }
});
//logout
app.get("/logout",function(req,res){
    
    req.session.cart=null;
    req.logout();
    res.redirect("/");
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl=req.url;
    res.redirect("/login");
    
}

app.get("/editpro",function(req,res){
  res.render("editpro",{
      currentUser:req.user});
});

app.get("/profile",function(req,res){
  res.render("profile",{
      currentUser:req.user});
});

app.get("/partner",function(req,res){
    res.render("partner");
});
app.get("/payment",isLoggedIn,function(req,res){
    if(!req.session.cart){
        return res.render("payment",{products:null})
    }
    var cart =new Cart(req.session.cart);
    res.render("payment",{products:cart.generateArray(),totalPrice:cart.totalPrice})
    
});


app.post("/checkout",isLoggedIn,function(req,res){
     if(!req.session.cart){
         return res.redirect("cart");
     };
    var user=req.user;
    var un=user.username;
    console.log("User is")
    console.log(un)
    var cart =new Cart(req.session.cart); 
    var cart=cart;
    var pno=req.body.pno;
    var address=req.body.address;
    var ostatus="Placed"
    var pincode=req.body.pincode;
    var myorder={user:user,un:un,cart:cart,pno:pno,address:address,ostatus:ostatus,pincode:pincode};
    Order.create(myorder,function(err,newlycreated){
        if(err){
            console.log(err);
        }
        else{
            req.session.cart=null;
            console.log(myorder)
    res.redirect("cust_mainpage");
        }
    })
    
});
    
app.get("/orderstatus",function(req, res) {
    Order.find({user:req.user},function(err,orders){
        if(err){
            return res.write("Error");
        };
        var cart;
        orders.forEach(function(order){
            cart=new Cart(order.cart);
            order.items=cart.generateArray();
        });
        
        res.render("orderstatus",{orders:orders});
    })
})



//chef login
app.get("/loginchef",function(req,res){
    res.render("loginchef");
});

app.post("/loginchef",passport.authenticate("local",{
    successRedirect: "/adddish",
    failureRedirect: "/loginchef"
}),function(req,res){
    
});
app.get("/logoutchef",function(req,res){
    req.logout();
    res.redirect("/partner");
});

//signup for chef
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
           res.redirect("/adddish");
       });
   });
});



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("its swiggy bitches");
});
