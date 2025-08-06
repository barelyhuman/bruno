const WebSocket = require("ws");
const wsConnections = new Map();

function createWsConnection(connectionId, url, protocols, options) {
    const ws = new WebSocket(url, protocols, options);
    wsConnections.set(connectionId, ws);
    return ws;
}

function closeWsConnection(connectionId) {
    const ws = wsConnections.get(connectionId);
    if (ws) {
        ws.close();
        wsConnections.delete(connectionId);
    }
}

function sendWsMessage(connectionId, message) {
    return new Promise((resolve, reject) => {
        const ws = wsConnections.get(connectionId);
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(message, (err) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        }
    });
}

module.exports = {
    createWsConnection,
    closeWsConnection,
    sendWsMessage,
    wsConnections,
};
