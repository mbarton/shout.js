const ShoutAudio = (function() {
    const ctx = new AudioContext();

    function downloadSample(sample) {
        const request = new Request(sample);

        fetch(request).then((response) => {
            return reponse.arrayBuffer();
        }).then((buffer) => {
            //   
        });
    }
}());