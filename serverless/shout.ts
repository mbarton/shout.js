class Shout {
    state: AppState;
    millisPerStep: number;

    transport: UI.TransportView;
    tracks: Array<UI.TrackView>;

    constructor() {
        this.state = DEFAULT_STATE;
        this.millisPerStep = audio.millisPerStep(this.state.bpm);

        this.transport = new UI.TransportView(this.togglePlayback);
        this.tracks = this.state.tracks.map((track) => new UI.TrackView(track));

        this.loadTracks();
        this.mountViews();
    }

    loadTracks = () => {
        this.state.tracks.forEach(( { name }, track) => {
            audio.loadSample(name).then((sample) => {
                this.state.tracks[track].sample = sample;
            });
        });
    }

    mountViews = () => {
        const base = document.querySelector(".container");
        base.appendChild(this.transport.element);

        this.tracks.forEach((track) => {
            base.appendChild(track.element);
        });
    }

    togglePlayback = () => {
        this.state.playing = !this.state.playing;
        this.transport.playing = this.state.playing;

        this.tracks.forEach((track) => {
            track.notes.forEach((note) => {
                note.active = false;
            });
        });

        if(this.state.playing) {
            this.step();
        }
    }

    step = () => {
        if(this.state.playing) {
            const stepBefore = this.state.step; 
            const stepNow = stepBefore == -1 ? 0 : (stepBefore + 1) % 16;

            this.tracks.forEach((track) => {
                if(stepBefore != -1) {
                    track.notes[stepBefore].active = false;
                }

                track.notes[stepNow].active = true;
            });

            this.state.step = stepNow;
            setTimeout(this.step, this.millisPerStep);
        }
    }
}

// class Shout extends React.Component<{}, AppState> {
//     millisPerStep: number;

//     constructor() {
//         super();
        
//         this.state = DEFAULT_STATE;
        
//     }

    

//     toggleNote = (track: number, note: number) => {
//         const newState = ModelHelpers.updateTrack(track, this.state, (track) => {
//             track.notes[note] = !track.notes[note];
//         });

//         this.setState(newState);
//     }

//     togglePlaying = () => {
//         const newState = Object.assign(this.state, { playing: !this.state.playing, step: -1} );
//         this.setState(newState);

//         this.step();
//     }

//     step = () => {
//         if(this.state.playing) {
//             const stepBefore = this.state.step; 
//             const stepNow = stepBefore == -1 ? 0 : (stepBefore + 1) % 16;

//             const newState = Object.assign(this.state, { step: stepNow } );
//             this.setState(newState);

//             setTimeout(this.step, this.millisPerStep);
//         }
//     }

//     render() {
//         const tracks = this.state.tracks.map((track, ix) => {
//             const toggleFn = (noteIx: number) => this.toggleNote(ix, noteIx);
//             return <TrackView key={ix} track={track} step={this.state.step} toggleNote={toggleFn} /> 
//         });

//         return <div>
//             <TransportView playing={this.state.playing} togglePlaying={this.togglePlaying} />
//             {tracks}
//         </div>;
//     }
// }

// ReactDOM.render(<Shout />, document.getElementById("root"));