// so the name doesn't conflict with the Audio tag oh my days
namespace AudioEngine {
    const context = new AudioContext();
    const rootSamplePath = "samples";

    export function millisPerStep(bpm: number): number {
        const secondsPerBeat = 1.0 / (bpm / 60.0);
        return (secondsPerBeat / 4.0) * 1000.0;
    }

    export function loadSample(sample: string): Promise<AudioBuffer> {
        const samplePath = rootSamplePath + "/" + sample + ".mp3";
        const request = new Request(samplePath);

        return fetch(request).then((response) =>
            response.arrayBuffer().then(decodeAudioData)
        );
    }

    export function playSample(sample: AudioBuffer) {
        const source = context.createBufferSource();
        source.buffer = sample;
        source.connect(context.destination);

        source.start();
    }

    function decodeAudioData(buffer: ArrayBuffer): Promise<AudioBuffer> {
        // stupid workaround. decodeAudioData has a promise based API but
        // to get it you need to need to upgrade to Typescript 2.0. That
        // would be nice but then all the WebRTC definitions stop working,
        // and you need them because RTCPeerConnection is mysteriously
        // left out from the default set of typings. Pain.

        return new Promise<AudioBuffer>((resolve, reject) => {
            context.decodeAudioData(buffer, (data) => {
                resolve(data);
            });
        });
    }
}
