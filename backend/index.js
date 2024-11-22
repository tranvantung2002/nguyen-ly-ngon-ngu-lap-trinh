'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

require('dotenv').config({ path: path.join(__dirname, '.env') });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
    origin: ["http://localhost:3060"],
    credentials: true,
    // optionSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use('/nguyen-ly', require('./src/routes/index.js'));

app.get("*", (req, res) => {
    res.json({ message: "uRL không tồn tại." });
    return res;
});
app.post("*", (req, res) => {
    res.json({ message: "Hệ thống đang nâng cấp vui lòng thử lại sau!", status: 0, encrypt: 0, error: [] });

    const requestUrl = req.originalUrl || req.url;
    console.error(`URL not supported: ${requestUrl}`);
    return res;
});

let PORT_SERVER = process.env.PORT_SERVER;
app.listen(PORT_SERVER, () => {
    console.log("SERVER CORE DICTIONARY RUNNING PORT: " + PORT_SERVER);
    String.prototype.clearSpace = function () {
        return this.trim().replace(/\n+/g, '\n');
    };
});
['SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, async function () {
        console.log('Got SIGINT.  Press Control-D to exit.', eventType);
        setTimeout(function () {
            console.log('Shutting down!!');
            process.exit(1);
        }, 1000);
    });
});