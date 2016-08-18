namespace Network {

    export class Client {
        conn: RTCPeerConnection;

        constructor() {
            this.conn = null;
            // this.conn = createConnection();
        }
    }

}