import mongoose from 'mongoose';

async function run() {
    await mongoose.connect('mongodb://localhost:27017/awtminiproject');
    const db = mongoose.connection;
    const collection = db.collection('resumeanalyses');
    const doc = await collection.findOne({});
    if (!doc) {
        console.log("No docs found!");
        process.exit(1);
    }
    console.log("Found doc ID:", doc._id.toString());
    
    // Test the internal route
    const url = `http://localhost:5002/internal/analysis/${doc._id.toString()}`;
    console.log("Fetching url:", url);
    try {
        const res = await fetch(url);
        console.log("Status:", res.status);
        console.log("Body:", await res.text());
    } catch(err) {
        console.error("Fetch err:", err);
    }
    
    process.exit(0);
}
run();
