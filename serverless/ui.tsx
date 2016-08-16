/// <reference path="typings/index.d.ts" />

const NoteView = ({ note, toggleNote } : { note: boolean, toggleNote: () => void} ) => {
    return <div className="one wide column">
        <button className={note ? "ui button active" : "ui button"} onClick={toggleNote} />
    </div>;
};

const TrackView = ({ track, toggleNote } : { track: Track, toggleNote: (noteIx: number) => void }) => {
    const notes = track.notes.map((note, ix) => {
        const toggleFn = () => toggleNote(ix);
        return <NoteView key={ix} note={note} toggleNote={toggleFn} />
    });

    return <div className="ui grid container">
        <div className="one wide column">
            <strong>{track.sample}</strong>
        </div>
        <div className="fifteen wide column">
            <div className="ui grid">
                {notes}
            </div>
        </div>
    </div>;
}

const TransportView = (props: { state: string }) => {
    return <div className="ui menu">
        <div className="header item">
            shout
        </div>
        <div className="right menu">
            <a className="item"><i className="large video play icon"></i></a>
        </div>
    </div>
}

