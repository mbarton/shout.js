/// <reference path="typings/index.d.ts" />

interface NoteViewProps { note: boolean, active: boolean, toggleNote: () => void }

class NoteView extends React.Component<NoteViewProps, {}> {
    shouldComponentUpdate = (nextProps: NoteViewProps, nextState: {}) => {
        return nextProps.note != this.props.note || nextProps.active != this.props.active;
    }

    render() {
        let buttonClass = "ui button";

        if(this.props.active) {
            buttonClass = "ui positive button";
        } else if(this.props.note) {
            buttonClass = "ui button active";
        }

        return <div className="one wide column">
            <button className={buttonClass} onClick={this.props.toggleNote} />
        </div>;
    }
}

const TrackView = ({ track, step, toggleNote } : { track: Track, step: number, toggleNote: (noteIx: number) => void }) => {
    const notes = track.notes.map((note, ix) => {
        const toggleFn = () => toggleNote(ix);
        return <NoteView key={ix} note={note} active={ix == step} toggleNote={toggleFn} />
    });

    return <div className="ui grid container">
        <div className="one wide column">
            <strong>{track.sampleName}</strong>
        </div>
        <div className="fifteen wide column">
            <div className="ui grid">
                {notes}
            </div>
        </div>
    </div>;
}

const TransportView = ({ playing, togglePlaying } : { playing: boolean, togglePlaying: () => void }) => {
    const iconImage = playing ? "stop circle" : "video play";
    const iconClass = `large ${iconImage} icon`;

    return <div className="ui menu">
        <div className="header item">
            shout
        </div>
        <div className="right menu">
            <a className="item" onClick={togglePlaying}><i className={iconClass}></i></a>
        </div>
    </div>
}

