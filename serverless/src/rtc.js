const ShoutRtc = (function() {
    // polyfill shit. fucking web development
    if(!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
        RTCPeerConnection = window.webkitRTCPeerConnection;
    }

    const rtcConfig = {
        // other STUN servers are available: http://olegh.ftp.sh/public-stun.txt
        // consult a medical professional before use
        "iceServers": [
            { "urls": ["stun:stun1.l.google.com:19302"] }
        ]
    }

    // returns a promise of all the SDP we could send to the other side of the connection
    createOffer = function() {
        const conn = new RTCPeerConnection(rtcConfig);
        const channel = conn.createDataChannel("shout");

        // clunky API is clunky. we have to wait for the right onicecandidate event
        return new Promise((resolve, reject) => {
            conn.onicecandidate = (event) => {
                if(event.candidate == null) {
                    resolve(conn.localDescription.sdp);
                }
            };

            conn.createOffer().then((offer) => {
                conn.setLocalDescription(offer);  
            }).catch((err) => {
                reject(err);
            }); 
        });
    }

    createAnswer = function(offer) {
        const conn = new RTCPeerConnection(rtcConfig);
        const desc = new RTCSessionDescription({ type: "offer", sdp: offer });

        console.log(offer);
        conn.setRemoteDescription(desc);

        return conn.createAnswer().then((answer) => {
            conn.setLocalDescription(answer);
            return answer;
        });
    }

    return {
        generateToken: () => {
            return createOffer().then((offer) => {
                return btoa(offer);
            });
        }
    }
}());