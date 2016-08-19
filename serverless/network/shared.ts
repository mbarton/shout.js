namespace Network {
    export const ICE_SERVERS = ["stun:stun.l.google.com:19302"];

    // the way this API is set up, it looks like we have to request
    // audio or video, even if we're just going to use data channels
    export const STREAM_CONFIG: MediaStreamConstraints = {
        audio: true, video: false
    }

    export const CHANNEL_NAME = "shout";

    export function createConnection(): RTCPeerConnection {
        const serverUrls = ICE_SERVERS.map((server) => {
            return { urls: [server] }
        });

        const config: RTCConfiguration = {
            iceServers: serverUrls
        }

        return new RTCPeerConnection(config);
    }
}