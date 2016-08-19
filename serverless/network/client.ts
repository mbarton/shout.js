namespace Network {

    export class Client {
        conn: RTCPeerConnection;
        resolveOffer: (string) => void = null;
        rejectOffer: (any) => void = null;
        channel: RTCDataChannel = null;

        constructor() {
            this.conn = createConnection();
            this.conn.onicecandidate = this.onicecandidate;
        }

        createOffer = () => {
            const ret = new Promise<String>((resolve, reject) => {
                this.resolveOffer = resolve;
                this.rejectOffer = reject;
            });

            navigator.mediaDevices.getUserMedia(STREAM_CONFIG).then((stream) => {
                this.channel = this.conn.createDataChannel(CHANNEL_NAME);
                this.conn.createOffer().then((sdp) => {
                    this.conn.setLocalDescription(sdp);
                });
            }).catch((err) => {
                this.rejectOffer(err);
            });

            return ret;
        }

        onicecandidate = (e: RTCIceCandidateEvent) => {
            if(e.candidate == null) {
                this.resolveOffer(this.conn.localDescription.sdp);
            }
        }
    }

}