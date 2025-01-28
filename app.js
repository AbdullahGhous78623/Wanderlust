if (process.env.NODE_ENV !="production"){
    require('dotenv').config()
}

const express=require("express");
const app = express();
const mongoose=require("mongoose");
const path=require("path");
const Listing=require("./models/listing.js")
const Review=require("./models/review.js")
const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")
let port =3000;
const wrapAsync=require("./utils/WrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js")
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs");
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")))
const methodOverride=require("method-override");
const { error } = require("console"); 
app.use(methodOverride("_method"))
// 2nd part authorisation and authentication
const cookieParser=require("cookie-parser")
app.use(cookieParser())
const session =require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")
const dbUrl=process.env.ATLASDB_URL
const store=MongoStore.create({
    mongoUrl:dbUrl, 
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
}) ;
store.on("error",()=>{
    console.log("error",err)
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};





main().then(( )=>{
    console.log("Connection Successful ");
}).catch((err)=>{
    console.log(err);
})


async function main() {
    await mongoose.connect(dbUrl);
}

// app.get("/",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.cookie("madeIn","India")
//     res.send("Send you some cookies!")
// })

// app.get("/greet",(res,req)=>{
//     let {name="Anonymous"}=req.cookies;
//     res.send(`Hi,${name}`);
// })

// ALSO STUDY SIGNED COOKIES.
// app.get("/",(req,res)=>{
//     // consile.dir(req.cookies);
    

//     res.send("Hi am root")
// })

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;

    next()
})

// app.get ("/demoUser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser)
// })

app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)
// reviews route
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"))
})

// app.use((err,req,res,next)=>{
//     let {statusCode=500,message="Somethong Went Wrong!"}=err;
//     // res.status(statusCode).send(message);
//     res.status(statusCode).render("error",{err});
// })
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Internal Server Error", details } = err;
    res.status(statusCode).render("error", { err: { statusCode, message, details } });
  });


app.listen(port,()=>{
    console.log(`App is running at port:${port}`)
})