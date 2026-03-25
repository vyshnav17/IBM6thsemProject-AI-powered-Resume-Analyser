const id = "64f1b2c3d4e5f6a7b8c9d0e1"; // fake id
fetch(`http://localhost:5003/download-analysis-report/${id}`)
    .then(async (res) => {
        console.log("Status:", res.status);
        console.log("Body:", await res.text());
    })
    .catch(console.error);
