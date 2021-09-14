const express = require("express");
const cors = require("cors"); //Cross-Origin Resource Sharing
const KJUR = require('jsrsasign');

const config = require("./config");

const app = express();
const port = 3444;

app.use(cors());

app.get("/", (request, response) => {
    response.json({ info: "Node.js, Express and Zoom API" });
});

app.get("/zoomcall/:userName", (req, res) => {
    console.log(req.params);
    const {userName} = req.params;
    const sessionName = `ZoomRoom${Math.floor(Math.random() * 100)}`;
    const sessionPassword = '';
    const signature = generateVideoToken(
        config.APIKey,
        config.APISecret,
        sessionName,
        sessionPassword
    );

    const data = {
        signature,
        sessionName,
        sessionPassword,
        userName
    };

    res.status(200).json(data);
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});

function generateVideoToken(sdkKey, sdkSecret, topic, password = "") {
    let signature = "";
    // try {
    const iat = Math.round(new Date().getTime() / 1000);
    const exp = iat + 60 * 60 * 2;

    // Header
    const oHeader = { alg: "HS256", typ: "JWT" };
    // Payload
    const oPayload = {
        app_key: sdkKey,
        iat,
        exp,
        tpc: topic,
        pwd: password,
    };
    // Sign JWT
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    signature = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdkSecret);
    return signature;
}