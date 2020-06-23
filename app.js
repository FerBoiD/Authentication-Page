var express                    =require("express"),
    mongoose                   =require("mongoose"),
    bodyParser                 =require("body-parser"),
    passport                   =require("passport"),
    LocalStrategy              =require("passport-local"),
    passportLocalMongoose      =require("passport-local-mongoose"),
    User                       =require("./models/user");
    
var app =express();
app.use(require("express-session")({
    secret:"Here can be any text and it is used to encode or decode the session",
    resave:false,
    saveUninitialized:false
}));
mongoose.connect("mongodb://localhost:/authentication",{useNewUrlParser:true , useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended:true}));    
app.set("view engine","ejs");

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//======================
//ROUTES
//======================

app.get("/",function(req,res){
    res.render("home");
})

app.get("/secret",isLoggedin,function(req,res){
    res.render("secret");
})

//==================
//Authentication Routes

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secret");
        })
    })
})
//==========
//LOGIN
app.get("/login",function(req,res){
    res.render("login");
})

app.post("/login",passport.authenticate("local",{//middleware
    successRedirect:"/secret",
    failureRedirect:"/login"
}),function(req,res){
})

//logout
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
})

function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000,function(){
    console.log("server has started.....");
})