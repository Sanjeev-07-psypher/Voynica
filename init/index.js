require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const MONGO_URL = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/voynica";

main()
    .then(()=>{
        console.log("connected to database");
    })
    .catch((err)=>{
        console.log(err)
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{ //this function is to clean pre-existing data 
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"684856355a28c99b4f252083",}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();