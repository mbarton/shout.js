/// <reference path="typings/index.d.ts" />

const NoteView = ({ note } : { note: boolean} ) => {
    return <div className="one wide column">
        <button className={note ? "ui button active" : "ui button"} />
    </div>;
};

const TrackView = ({ track } : { track: Track }) => {
    const notes = track.notes.map((note, ix) => {
        return <NoteView key={ix} note={note} />;
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

