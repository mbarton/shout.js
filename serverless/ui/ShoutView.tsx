namespace UI {
    export class ShoutView extends React.Component<{ reactor: Reactor }, AppState> {
        constructor(props, context) {
            super(props, context);

            this.props.reactor.view = this;
            this.state = this.props.reactor.state;
        }

        render() {
            const tracks = this.state.tracks.map((track, ix) => {
                return <TrackView key={ix} track={track} trackIx={ix} reactor={this.props.reactor} />
            });

            return <div className="container">
                <TransportView playing={this.state.playback.playing} reactor={this.props.reactor} />
                {tracks}
            </div>;
        }
    }
}