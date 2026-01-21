// WebSocket transport implementation for MCP

class WebSocketTransport {
    constructor(url) {
        this.url = url;
        this.socket = null;
    }

    connect() {
        this.socket = new WebSocket(this.url);
        this.socket.onopen = () => {
            console.log('WebSocket connected');
        };
        this.socket.onmessage = (message) => {
            console.log('Message received:', message.data);
        };
        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
        };
    }

    send(data) {
        if (this.socket) {
            this.socket.send(JSON.stringify(data));
        }
    }

    close() {
        if (this.socket) {
            this.socket.close();
        }
    }
}

export default WebSocketTransport;
