const ShoutAudio = (function() {
    const samplePath = "samples";
    const ctx = new AudioContext();

    const samples = new Map();
    
    let ticker = null;
    let step = 0;

    function rackEmUp(start, rate, tracks) {
        console.log(start);
        console.log(rate);
        console.log(tracks);
    }

    return {
        start: (config, tickFn) => {
            step = 0;

            const rate = (1 / (config.bpm * 4)) * (60 * 1000);
            const update = () => {
                step = (step + 1) % 16;

                if(step == 15) {
                    rackEmUp(ctx.currentTime + (rate * 4), rate, config.tracks);
                }

                tickFn(step);
            };

            rackEmUp(ctx.currentTime, rate, config.tracks);
            ticker = setInterval(update, rate);
            tickFn(0);
        },

        stop: () => {
            clearInterval(ticker);
        },

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