const meetingStatus = require('./data');
const rp = require("request-promise");
const actions = require('./actions');

class MeetingActions {
    async start(req, res, next) {
        res.json({info: "Node.js, Express and Zoom API"});
    }
    async createHost(req, res, next) {
        let {email, userName} = await req.body;

        if (!email) email = process.env.EMAIL;

        const apiKey = process.env.API_KEY;
        const apiSecret = process.env.API_SECRET;
        const token = await actions.createToken(apiKey, apiSecret);

        const options = {
            method: "POST",
            uri: `https://api.zoom.us/v2/users/${email}/meetings`,
            body: {
                topic: "Meeting",
                type: 1,
                settings: {
                    host_video: "true",
                    participant_video: "true",
                    waiting_room: "false",
                    show_share_button: "true",
                    join_before_host: "false",
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
                const joinURL = response.join_url;
                const meetingNumber = response.id;
                const password = response.encrypted_password;

                const signature = actions.generateSignature(apiKey, apiSecret, meetingNumber, 1);

                meetingStatus.data.roomLink = joinURL;

                res.status(200).json({
                    joinURL,
                    name: userName,
                    mn: meetingNumber,
                    pwd: password,
                    role: 1,
                    email,
                    lang: "en_US",
                    signature,
                    china: 0,
                    apiKey
                });
            })
            .catch(function (err) {
                res.status(500).json(err.message);
                console.log("API call failed, reason ", err.message);
            });
    }
    async create(req, res, next) {
        try {
            const host = req.body;

            if (host.isHost && host.userName) {
                meetingStatus.data.isHost = true;
                res.status(200).json('Room activated');
            }
        } catch (e) {
            next(e);
        }

    }
    async join(req, res, next) {
        console.log('Join status: ', meetingStatus.data);
        res.status(200).json(meetingStatus.data);
    }
    async leave(req, res, next) {
        meetingStatus.data.isHost = false;
        meetingStatus.data.roomLink = '';
        console.log('Room closed', meetingStatus.data);
        res.status(200);
    }
}


module.exports = new MeetingActions();