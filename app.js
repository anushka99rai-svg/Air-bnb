const mongoose=require("mongoose");
const express=require("express");
const app=express();
const path=require("path");
const PORT=8080;
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const Listing=require("./models/listing.js");
const methodOverride=require("method-override");
const engine=require("ejs-mate");

app.engine("ejs",engine);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));


async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("Connection succesful");
}).catch((err)=>{
    console.log(err);
})

app.get("/",(req,res)=>{
    res.send("Starting working");
})

app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.post("/listings",async(req,res)=>{
    let {title,description,image,price,location,country}=req.body;
    let newListing=new Listing({
        title:title,
        description:description,
        price:price,
        location:location,
        country:country
    });
    await newListing.save();
    console.log("Data inserted successfully");
    res.redirect("/listings");
})

app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    let listing=await Listing.findById({_id:id});
    res.render("listings/show.ejs",{listing});
})

app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
})

app.patch("/listings/:id",async(req, res)=>{
    let{id}=req.params;
    let {title,description,price,image,loaction, country, }=req.body;
    let listing=await Listing.findByIdAndUpdate(id,{
                 title:title,
                 description:description,
                 image:image,
                 price:price,
                 loaction:loaction,
                 country:country
            });
    res.redirect("/listings");
})

app.delete("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndDelete(id);
  console.log("Removed completely");
  res.redirect("/listings");
})

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