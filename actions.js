const jwt = require("jsonwebtoken");
const crypto = require('crypto');

class Actions {
    createToken(apiKey, apiSecret) {
        return jwt.sign({
            iss: apiKey,
            exp: new Date().getTime() + 5000,
        }, apiSecret);
    }

    generateSignature(apiKey, apiSecret, meetingNumber, role) {
        const timestamp = new Date().getTime() - 30000;
        const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64');
        const hash = crypto
            .createHmac('sha256', apiSecret)
            .update(msg)
            .digest('base64');

        return Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');
    }
}

module.exports = new Actions();