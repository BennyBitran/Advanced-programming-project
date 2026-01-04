const net = require('net');

const DEFAULT_HOST = process.env.BACKEND_HOST || "127.0.0.1";
const DEFAULT_PORT = Number(process.env.BACKEND_PORT || 8080);

async function sendRequest(message, host = DEFAULT_HOST, port = DEFAULT_PORT) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        let buffer = Buffer.alloc(0);
        let expectedLength = -1;

        client.connect(port, host, () => {
            // format for sending: end with a \n (maybe should change to \r\r\n\r)
            client.write(message + "\n");
        });

        client.on('data', (chunk) => {
            buffer = Buffer.concat([buffer, chunk]);

            // format for reading: length prefix 4 bytes as big-endian
            if (expectedLength === -1 && buffer.length >= 4) {
                expectedLength = buffer.readUInt32BE(0);
            }

            //wait for buffer to get the whole message (checks 4 + expected length)
            if (expectedLength !== -1 && buffer.length >= (4 + expectedLength)) {
                //save buffer content
                const rawResponse = buffer.slice(4, 4 + expectedLength).toString();
                //close connection instantly (free backend connection + thread)
                client.destroy();
                //parse to a JSON and return result, or reject on error status
                const result = parseResponse(rawResponse);
                if (result?.status && result.status >= 400) {
                    reject(result);
                } else {
                    resolve(result);
                }
            }
        });

        client.on('error', (err) => {
            client.destroy();
            reject({ status: 500, message: err.message });
        });
    });
}


// Helper function to parse raw response from backend into structured object (JSON)
function parseResponse(raw) {
    // Strip the last \n of raw
    const cleanRaw = raw.endsWith('\n') ? raw.slice(0, -1) : raw;

    // Split by the first newline to get the status line
    const firstNewlineIndex = cleanRaw.indexOf('\n');
    const statusLine = firstNewlineIndex === -1 ? cleanRaw : cleanRaw.substring(0, firstNewlineIndex);

    // Save first 3 chars to int (status code) and skip space for status line
    const statusCode = parseInt(statusLine.substring(0, 3));
    const statusText = statusLine.trim();

    // Check for \n\n representing start of content body
    let content = "";
    const doubleNewlineIndex = cleanRaw.indexOf('\n\n');

    // If exists, remove it and save the rest to content body
    if (doubleNewlineIndex !== -1) {
        // The content starts after the \n\n
        content = cleanRaw.substring(doubleNewlineIndex + 2);
    }
    
    return {
        status: statusCode,
        statusText: statusText,
        content: content
    };
}


module.exports = {
    sendRequest
};