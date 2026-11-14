const mongoose=require("mongoose");
const express=require("express");
const app=express();
const path=require("path");
const PORT=8080;
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const Listing=require("./models/listing.js");
const methodOverride=require("method-override");
const engine=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");

app.engine("ejs",engine);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.json());


async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("Connection succesful");
}).catch((err)=>{
    console.log(err);
})

const validateListing=(req,res,next)=>{
     let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
app.get("/",(req,res)=>{
    res.send("Starting working");
})

app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.post("/listings",validateListing,wrapAsync(async(req,res)=>{
    let {title,description,image,price,location,country}=req.body;
    let newListing=new Listing(req.body.listing);
    await newListing.save();
    console.log("Data inserted successfully");
    res.redirect("/listings");
}))

app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}))

app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))

app.patch("/listings/:id",validateListing,wrapAsync(async(req, res)=>{
    let{id}=req.params;
    // let {title,description,price,image,loaction, country, }=req.body.listing;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

app.delete("/listings/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndDelete(id);
  console.log("Removed completely");
  res.redirect("/listings");
}))

app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
   let {id}=req.params;
   let listing=await Listing.findById(id);
   let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id/reviews/:reviewId",async(req,res)=>{
    let { id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
})

app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"Page not found !"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500, message="Something went wrong"}=err;
    res.render("listings/error.ejs",{message,statusCode});
});

app.listen(PORT,()=>{
    console.log(`App is listening at port ${PORT}`);
})
// app.get("/testListing",async (req,res)=>{
//     let newList=new Listing({
//         title:"My home",
//         description:"A beautiful beach house",
//         price:2000,
//         location:"Goa",
//         country:"India"
//     });
//     await newList.save();
//     console.log("Data saved succesful");
//     res.send("Succesful");
// })