class Shout {
    reactor: Reactor;
    millisPerStep: number;

    constructor(containerId: string) {
        this.reactor = new Reactor(DEFAULT_STATE);
        
        const ui = <UI.ShoutView reactor={this.reactor} />;
        ReactDOM.render(ui, document.getElementById(containerId));

        this.millisPerStep = AudioEngine.millisPerStep(this.reactor.state.bpm);

        // this.loadTracks();
        // this.mountViews();
    }

    // loadTracks = () => {
    //     this.state.tracks.forEach(( { name }, track) => {
    //         AudioEngine.loadSample(name).then((sample) => {
    //             this.state.tracks[track].sample = sample;
    //         });
    //     });
    // }

    // toggleNote = (ixTrack: number, ixNote: number) => {
    //     const track = this.state.tracks[ixTrack];
    //     const trackView = this.tracks[ixTrack];

    //     track.notes[ixNote] = !track.notes[ixNote];
    //     trackView.notes[ixNote].on = track.notes[ixNote];
    // }

    // togglePlayback = () => {
    //     this.state.playing = !this.state.playing;
    //     this.transport.playing = this.state.playing;

    //     this.tracks.forEach((track) => {
    //         track.notes.forEach((note) => {
    //             note.active = false;
    //         });
    //     });

    //     if(this.state.playing) {
    //         this.step();
    //     } else {
    //         this.state.step = -1;
    //     }
    // }

    // step = () => {
    //     if(this.state.playing) {
    //         const stepBefore = this.state.step; 
    //         const stepNow = stepBefore == -1 ? 0 : (stepBefore + 1) % 16;

    //         for(let i = 0; i < this.state.tracks.length; i++) {
    //             const trackView = this.tracks[i];
    //             const track = this.state.tracks[i];

    //             if(stepBefore != -1) {
    //                 trackView.notes[stepBefore].active = false;
    //             }

    //             trackView.notes[stepNow].active = true;

    //             if(track.notes[stepNow]) {
    //                 AudioEngine.playSample(track.sample);
    //             }
    //         }

    //         this.state.step = stepNow;
    //         setTimeout(this.step, this.millisPerStep);
    //     }
    // }

    // startShare = () => {
    //     const client = new Network.Client();
    //     client.createOffer().then((sdp) => console.log(sdp));
    // }
}
