const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wandrrlust";

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
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();