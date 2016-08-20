// so the name doesn't conflict with the Audio tag oh my days
class AudioEngine {
    private context = new AudioContext();
    private rootSamplePath = "samples";
    
    private reactor: Reactor;
    private tickRate: number;
    private step = 0;

    constructor(_reactor: Reactor) {
        this.reactor = _reactor;
        this.tickRate = this.millisPerStep(this.reactor.state.bpm);
    }

    set state(state: AppState) {
        this._state = state;
    }

    start = () => {

    }

    private tick = () => {
        this._state.tracks.forEach((track) => {

        });

        this.step++;
    }

    private loadSample(sample: string): Promise<AudioBuffer> {
        const samplePath = this.rootSamplePath + "/" + sample + ".mp3";
        const request = new Request(samplePath);

        return fetch(request).then((response) => {
            return response.arrayBuffer().then((buf) => {
                return this.decodeAudioData(buf)
            });
        });
    }

    private decodeAudioData(buffer: ArrayBuffer): Promise<AudioBuffer> {
        // stupid workaround. decodeAudioData has a promise based API but
        // to get it you need to need to upgrade to Typescript 2.0. That
        // would be nice but then all the WebRTC definitions stop working,
        // and you need them because RTCPeerConnection is mysteriously
        // left out from the default set of typings. Pain.

        return new Promise<AudioBuffer>((resolve, reject) => {
            this.context.decodeAudioData(buffer, (data) => {
                resolve(data);
            });
        });
    }

    private millisPerStep(bpm: number): number {
        const secondsPerBeat = 1.0 / (bpm / 60.0);
        return (secondsPerBeat / 4.0) * 1000.0;
    }
}


namespace AudioEngine {
    const context = new AudioContext();
    const rootSamplePath = "samples";

    export 

    export function loadSample(sample: string): Promise<AudioBuffer> {
        
    }

    export function playSample(sample: AudioBuffer) {
        const source = context.createBufferSource();
        source.buffer = sample;
        source.connect(context.destination);

        source.start();
    }

    
}
