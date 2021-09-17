const express = require("express");
const cors = require("cors"); //Cross-Origin Resource Sharing
const crypto = require('crypto') // crypto comes with Node.js

const app = express();
const port = 3444;

app.use(cors());

app.get("/", (request, response) => {
    response.json({ info: "Node.js, Express and Zoom API" });
});

app.get("/zoomcall/:userName", (req, res) => {
    console.log(req.params);

    const {userName} = req.params;
    const meetingNumber = 2342347673;
    const role = 1;

    const signature = generateSignature(APIKey, APISecret, meetingNumber, role);

    const data = {
        signature,
        apiKey: config.APIKey,
        meetingNumber,
        role,
        userName
    };

    res.status(200).json(data);
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});

function generateSignature(apiKey, apiSecret, meetingNumber, role) {
    // Prevent time sync issue between client signature generation and zoom
    const timestamp = new Date().getTime() - 30000
    const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64')
    const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64')
    const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64')

    return signature
}