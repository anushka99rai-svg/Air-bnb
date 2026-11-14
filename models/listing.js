const mongoose=require("mongoose");
const {Schema}=require("mongoose");
const Review=require("./review.js");

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
    },
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review"
        }
    ]
});

listingSchema.post("findOneAndDelete", async(listing)=>{
        if(listing){
            await Review.deleteMany({_id:{$in:listing.reviews}});
        }
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;