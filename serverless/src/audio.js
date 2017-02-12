const ShoutAudio = (function() {
    const samplePath = "samples";
    const ctx = new AudioContext();

    const samples = new Map();
    
    let ticker = null;
    let config = null;

    let step = 0;
    let nodes = [];

    function rackEmUp(start, step, tracks) {
        nodes = [];

        tracks.forEach((track) => {
            if(track.notes[step]) {
                const sample = samples.get(track.name);
                const node = ctx.createBufferSource();

                node.buffer = sample;
                node.connect(ctx.destination);
                node.start(start);

                nodes.push(node);
            }
        });
    }

    return (tickFn) => {
        return {
            setConfig: (_config) => {
                config = _config;
            },

            start: () => {
                const rate = (1 / (config.bpm * 4)) * (60 * 1000);
                const nextTime = ctx.currentTime + (rate / 1000.0);

                if(ticker === null) {
                    ticker = setInterval(() => {
                        nodes = [];
                        step = (step + 1) % 16;

                        const nextTime = ctx.currentTime + (rate / 1000.0);
                        const nextStep = (step + 1) % 16;

                        rackEmUp(nextTime, nextStep, config.tracks);
                        tickFn(step);
                    }, rate);
                }

                rackEmUp(ctx.currentTime, step, config.tracks);
                rackEmUp(nextTime, step + 1, config.tracks);

                tickFn(0);
            },

            stop: () => {
                nodes.forEach((node) => {
                    node.stop();
                });

                nodes = [];
                step = 0;

                clearInterval(ticker);
                ticker = null;
            },

            downloadSample: (sample) => {
                const path = `${samplePath}/${sample}.mp3`;
                const request = new Request(path);

                return fetch(request).then((response) => {
                    return response.arrayBuffer();
                }).then((buffer) => {
                    return ctx.decodeAudioData(buffer).then((data) => {
                        samples.set(sample, data);
                        return sample;
                    });
                });
            }
        }
    }
}());