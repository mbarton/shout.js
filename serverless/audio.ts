namespace audio {
    const context = new AudioContext();
    const rootSamplePath = "samples";

    export function millisPerStep(bpm: number): number {
        const secondsPerBeat = 1.0 / (bpm / 60.0);
        return (secondsPerBeat / 4.0) * 1000.0;
    }

    export function loadSample(sample: string): Promise<AudioBuffer> {
        const samplePath = rootSamplePath + "/" + sample + ".mp3";
        const request = new Request(samplePath);

        return fetch(request).then((response) => {
            return response.arrayBuffer().then((buffer) => {
               return context.decodeAudioData(buffer);
            });
        });
    }
}