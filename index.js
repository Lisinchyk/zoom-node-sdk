const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const rp = require("request-promise");
const crypto = require('crypto');

const app = express();

const PORT = process.env.PORT || 3444;
const APIKey = process.env.APIKey;
const APISecret = process.env.APISecret;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
}));

app.get("/", (request, response) => {
    response.json({info: "Node.js, Express and Zoom API"});
});


app.post("/zoomcall", (req, res) => {
    const {email, userName} = req.body;

    const token = jwt.sign({
        iss: APIKey,
        exp: new Date().getTime() + 5000,
    }, APISecret);

    const options = {
        method: "POST",
        uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
        body: {
            topic: "Meeting",
            type: 1,
            settings: {
                host_video: "true",
                participant_video: "true",
            },
        },
        auth: {
            bearer: token,
        },
        headers: {
            "User-Agent": "Zoom-api-Jwt-Request",
            "content-type": "application/json",
        },
        json: true, //Parse the JSON string in the response
    };

    rp(options)
        .then(function (response) {
            const info = response.join_url.replaceAll('https://us04web.zoom.us/j/', '').split('?');
            const meetingNumber = +info[0];
            const password = info[1].replaceAll('pwd=', '');

            const signature = generateSignature(APIKey, APISecret, meetingNumber, 1);

            const data = {
                name: userName,
                mn: meetingNumber,
                pwd: password,
                role: 1,
                email,
                lang: "en_US",
                signature,
                china: 0,
                APIKey
            }

            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json(err.message);
            console.log("API call failed, reason ", err);
        });
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`);
});

function generateSignature(apiKey, apiSecret, meetingNumber, role) {
    const timestamp = new Date().getTime() - 30000;
    const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64');
    const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64');
    const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');

    return signature;
}