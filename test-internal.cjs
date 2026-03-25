import fetch from "node-fetch";

// We don't have node-fetch here maybe. Let's use global fetch.
const ANALYZER_SERVICE_URL = process.env.ANALYZER_SERVICE_URL || 'http://localhost:5002';
// A 24 char hex
const fakeId = '650b4a45f9c4123412341234';

async function test() {
    console.log(`Connecting to ${ANALYZER_SERVICE_URL}/internal/analysis/${fakeId}`);
    try {
        const response = await fetch(`${ANALYZER_SERVICE_URL}/internal/analysis/${fakeId}`);
        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Body:", text);
    } catch(e) {
        console.error("Fetch err:", e.message);
    }
}
test();
