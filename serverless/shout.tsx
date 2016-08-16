class Shout extends React.Component<{}, AppState> {
    constructor() {
        super();
        this.state = DEFAULT_STATE;
    }

    toggleNote(track: number, note: number) {
        const newState = ModelHelpers.toggleNote(track, note, this.state);
        this.setState(newState);
    }

    render() {
        const tracks = this.state.tracks.map((track, ix) => {
            const toggleFn = (noteIx: number) => this.toggleNote(ix, noteIx);
            return <TrackView key={ix} track={track} toggleNote={toggleFn} /> 
        });

        return <div>
            <TransportView state={this.state.playbackState} />
            {tracks}
        </div>;
    }
}

ReactDOM.render(<Shout />, document.getElementById("root"));