const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://unsplash.com/photos/brown-hut-near-body-of-water-oji_NGmBI5o",
        set:(v)=> v===""?"https://unsplash.com/photos/brown-hut-near-body-of-water-oji_NGmBI5o":v
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    }
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;