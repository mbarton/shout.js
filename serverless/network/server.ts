namespace Network {
    export class Server {
        conn: RTCPeerConnection;
        channel: RTCDataChannel;

        constructor() {
            this.conn = createConnection();
            this.conn.onicecandidate = this.onicecandidate;

            this.conn.ondatachannel = (e) => {
                this.channel = e.channel;
            }

            this.launch();
        }

        launch = () => {
            navigator.mediaDevices.getUserMedia(STREAM_CONFIG).then((stream) => {
                // TODO MRB: something useful here?
            }).catch((err) => {
                console.log("The user denied us microphone access. Boo! - " + err.name);
            });
        }

        connect = (offerSdp: string) => {
            const offer = new RTCSessionDescription( { type: "offer", sdp: offerSdp });
            this.conn.setRemoteDescription(offer).then(() => {
                console.log("create answer");

                this.conn.createAnswer().then((answer) => {
                    console.log("sld");

                    this.conn.setLocalDescription(answer).then(() => {
                        console.log(answer.sdp);
                    });
                });
            }).catch((e) => {
                console.log("Unable to connect");
                console.log(e); 
            });
        }

        onicecandidate = (e: RTCIceCandidateEvent) => {
            console.log(e.candidate.candidate);
        }
    }
}