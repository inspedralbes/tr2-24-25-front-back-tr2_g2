const { Server } = require('socket.io');
const { createServer } = require('http');
const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');
const { request } = require('undici');
require('dotenv').config();
const fs = require('fs');



const port = process.env.PORT;
const clientID = process.env.clientID;
const clientSecret = process.env.clientSecret;
const app = express();

app.get('/', async ({ query }, response) => {
    const { code } = query;

    if (code) {
        try {
            const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
                method: 'POST',
                body: new URLSearchParams({
                    client_id: clientID,
                    client_secret: clientSecret,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: `http://localhost:${port}`,
                    scope: 'identify email',
                }).toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const oauthData = await tokenResponseData.body.json();
            console.log('OAuth data:', oauthData);
            const userResult = await request('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${oauthData.token_type} ${oauthData.access_token}`,
                },
            });
            console.log('User data:', await userResult.body.json());
        } catch (error) {
            // NOTE: An unauthorized token will not throw an error
            // tokenResponseData.statusCode will be 401
            console.error(error);
        }
    }

    return response.sendFile('index.html', { root: '.' });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});