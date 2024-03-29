const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

module.exports = { server, wss, app };
