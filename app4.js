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
    saveUninitialized: false
}));

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    //res.locals.currentChef=req.chef;//chef
    res.locals.session=req.session;
    next();//its very imp so that this middleware will run for every route
});

var dishSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String

});
var newdish = mongoose.model("newdish", dishSchema);


app.get("/", function(req, res){
    // Get all campgrounds from DB
    newdish.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
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
      }) 
        
        res.render("chefmain",{campgrounds:allCampgrounds,orders:orders});
    })
          
       }
    });
});




app.get("/chef",function(req, res) {
   
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
      }) 
        console.log()
        res.render("chef",{orders:orders});
    })
});
app.get("/adddish",function(req,res){
    res.render("adddish");
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
      Order.update({}, { ostatus: "Dispatched"}, {multi : true}, function(err,order){
          if(err){
              console.log(err)
          }
      }) 
        console.log(orders)
        res.render("changestatus",{orders:orders});
    })
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("its swiggy bitches");
});