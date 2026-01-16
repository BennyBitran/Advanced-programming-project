const net = require('net');

const DEFAULT_HOST = process.env.BACKEND_HOST || "127.0.0.1";
const DEFAULT_PORT = Number(process.env.BACKEND_PORT || 8080);

// Sends a request message to the backend C++ server and returns a structured response
async function sendRequest(message, host = DEFAULT_HOST, port = DEFAULT_PORT) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        let buffer = Buffer.alloc(0);
        let expectedLength = -1;
        let headerOffset = -1;

        client.connect(port, host, () => {
            const payload = message;
            const length = Buffer.byteLength(payload);
            // Protocol: Length + \n + Message
            client.write(length + "\n" + payload);
        });

        client.on('data', (chunk) => {
            buffer = Buffer.concat([buffer, chunk]);

            if (expectedLength === -1) {
                const bufferString = buffer.toString();
                const newlineIndex = bufferString.indexOf('\n');

                if (newlineIndex !== -1) {
                    const lengthStr = bufferString.substring(0, newlineIndex);  //catch length string
                    expectedLength = parseInt(lengthStr, 10);
                    headerOffset = newlineIndex + 1;
                }
            }

            // Check if we have received the full message (header + body)
            if (expectedLength !== -1 && buffer.length >= (headerOffset + expectedLength)) {
                // Extract the raw response message
                const rawResponse = buffer.slice(headerOffset, headerOffset + expectedLength).toString();
                //disconnect from cpp server
                client.destroy();
                
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