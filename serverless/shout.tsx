class Shout extends React.Component<{}, AppState> {
    constructor() {
        super();
        this.state = DEFAULT_STATE;
    }

    render() {
        const tracks = this.state.tracks.map((track, ix) => {
            return <TrackView key={ix} track={track} /> 
        });

        return <div>
            <TransportView state={this.state.playbackState} />
            {tracks}
        </div>;
    }
}

ReactDOM.render(<Shout />, document.getElementById("root"));