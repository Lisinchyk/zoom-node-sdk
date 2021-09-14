const express = require("express");
const cors = require("cors"); //Cross-Origin Resource Sharing

const bodyParser = require("body-parser");

//include required modules
const jwt = require("jsonwebtoken");
const config = require("./config");
const rp = require("request-promise");

const app = express();
const port = 3444;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

const payload = {
  iss: config.APIKey,
  exp: new Date().getTime() + 5000,
};

const token = jwt.sign(payload, config.APISecret);
app.post("/zoomcall", (req, res) => {
  const email = req.body.email;
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
      console.log("response is: ", response.join_url);

      let dataRes = {
        join_url: response.join_url,
      };
      res.status(200).json(dataRes);

      // res.send("create meeting result: " + JSON.stringify(response));
    })
    .catch(function (err) {
      console.log("API call failed, reason ", err);
    });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});