class Shout extends React.Component<{}, AppState> {
    millisPerStep: number;

    constructor() {
        super();
        
        this.state = DEFAULT_STATE;
        this.loadTracks();
        this.millisPerStep = audio.millisPerStep(this.state.bpm);
    }

    loadTracks = () => {
        this.state.tracks.forEach(( { sampleName }, track) => {
            audio.loadSample(sampleName).then((sample) => {
                const newState = ModelHelpers.updateTrack(track, this.state, (track: Track) => {
                    track.sample = sample;
                });

                this.setState(newState);
            });
        });
    }

    toggleNote = (track: number, note: number) => {
        const newState = ModelHelpers.updateTrack(track, this.state, (track) => {
            track.notes[note] = !track.notes[note];
        });

        this.setState(newState);
    }

    togglePlaying = () => {
        const newState = Object.assign(this.state, { playing: !this.state.playing, step: -1} );
        this.setState(newState);

        this.step();
    }

    step = () => {
        if(this.state.playing) {
            const stepBefore = this.state.step; 
            const stepNow = stepBefore == -1 ? 0 : (stepBefore + 1) % 16;

            const newState = Object.assign(this.state, { step: stepNow } );
            this.setState(newState);

            setTimeout(this.step, this.millisPerStep);
        }
    }

    render() {
        const tracks = this.state.tracks.map((track, ix) => {
            const toggleFn = (noteIx: number) => this.toggleNote(ix, noteIx);
            return <TrackView key={ix} track={track} step={this.state.step} toggleNote={toggleFn} /> 
        });

        return <div>
            <TransportView playing={this.state.playing} togglePlaying={this.togglePlaying} />
            {tracks}
        </div>;
    }
}

ReactDOM.render(<Shout />, document.getElementById("root"));