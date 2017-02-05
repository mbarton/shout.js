const ShoutAudio = (function() {
    const samplePath = "samples";
    const ctx = new AudioContext();

    const samples = new Map();

    return {
        downloadSample: (sample, callback) => {
            const path = `${samplePath}/${sample}.mp3`;
            const request = new Request(path);

            fetch(request).then((response) => {
                return response.arrayBuffer();
            }).then((buffer) => {
                ctx.decodeAudioData(buffer, (data) => {
                    samples.set(sample, buffer);
                    callback(sample);
                });
            });
        }
    }
}());