const fetch = require('node-fetch'); // or just use global fetch if node >= 18
const url = "http://localhost:5002/internal/analysis/";
// Wait, we need an ID. Let's just create a dummy ID that is precisely 24 hex characters to avoid the ObjectId cast error.
const goodId = "5f9c9f2f8b2d3c1a2b3c4d5e";
fetch(url + goodId)
.then(res => res.text().then(text => console.log("Status:", res.status, "Body:", text)))
.catch(err => console.error("Error:", err));
