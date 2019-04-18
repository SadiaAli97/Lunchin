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
     Deliver=require("./models/deliver");   
   
  
    
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

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Deliver.authenticate()));//deliver authenticate is already availabe coz of passport local mongoose in deliver.js we neednt write the whole code
passport.serializeUser(Deliver.serializeUser());
passport.deserializeUser(Deliver.deserializeUser());



app.use(function(req,res,next){
    res.locals.currentDeliver=req.deliver;
    
    res.locals.session=req.session;
    next();//its very imp so that this middleware will run for every route
});





app.get("/",function(req, res){
   res.render("landing3");
});
app.get("/trialpage",function(req,res){
    res.render("trialpage");
});


app.get("/deliver",function(req,res){
    res.render("deliver");
});

//login for delivery boy
app.get("/deli_login",function(req,res){
    res.render("deli_login");
});

app.post("/deli_login",passport.authenticate("local",{
    successRedirect: "/trialpage",
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
    var newDeliver = new Deliver({
        username: req.body.username,
        pno: req.body.pno,
        available:"true"
        
    });
    
   Deliver.register(newDeliver, req.body.password,function(err,deliver){//only crneate object for username not for password as only to store username in database
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

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("its swiggy bitches");
});
