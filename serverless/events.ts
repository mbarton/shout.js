interface NoteEnabledEvent {
    track: number,
    note: number,
    enabled: boolean
}

interface NoteActiveEvent {
    track: number,
    note: number,
    active: boolean
}

interface PlaybackEvent {
    playing: boolean
}

class Reactor {
    private _state: AppState;
    private _view: UI.ShoutView = null;

    constructor(initialState: AppState) {
        this._state = initialState;
    }

    get state() { return this._state; }

    set view(view: UI.ShoutView) {
        this._view = view;
    }

    dispatch = (event: any) => {
        if(this.isNoteEvent(event)) {
            this._state.tracks[event.track].notes[event.note].enabled = event.enabled;
        } else if(this.isPlaybackEvent(event)) {
            this._state.playback.playing = event.playing;
        } else {
            console.error("Unknown event");
            console.error(event);
        }

        this._view.setState(this._state);
    }

    isNoteEvent(e: any): e is NoteEnabledEvent {
        return this.checkFields(e, ["track", "note", "enabled"]);
    }

    isPlaybackEvent(e: any): e is PlaybackEvent {
        return this.checkFields(e, ["playing"]);
    }

    checkFields(e: any, fields: Array<string>): boolean {
        return fields.every((field) =>
            e.hasOwnProperty(field)
        );
    }
}