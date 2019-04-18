var express     =require("express"),
    app         =express(),
    bodyParser  =require("body-parser"),
    Driver      =require("./models/driver"),
    
     passport=require("passport"),
     LocalStrategy=require("passport-local"),
     cookieParser = require("cookie-parser"),
    mongoose    =require("mongoose"),
     flash = require("connect-flash"),
    session = require("express-session"),
    MongoStore = require("connect-mongo")(session),
    Cart =require("./models/cart"),
    Chef=require("./models/chef");//chef
const methodOverride = require('method-override');    
    
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
passport.use(new LocalStrategy(Driver.authenticate()));//user authenticate is already availabe coz of passport local mongoose in user.js we neednt write the whole code
passport.serializeUser(Driver.serializeUser());
passport.deserializeUser(Driver.deserializeUser());

app.use(function(req,res,next){
    
    res.locals.currentChef=req.chef;//chef
    res.locals.session=req.session;
    next();//its very imp so that this middleware will run for every route
});
 
 
app.get("/",function(req, res){
   res.render("landing3");//landing2 is for chef
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
    successRedirect: "/Currentdishes",
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
           res.redirect("/Currentdishes");
       });
   });
});



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("its swiggy bitches");
});
