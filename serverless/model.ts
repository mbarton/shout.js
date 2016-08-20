interface Note {
    enabled: boolean;
    active: boolean;
}

interface Track {
    name: string;
    notes: Array<Note>;
}

interface PlaybackState {
    playing: boolean;
    step: number;
}

interface AppState {
    bpm: number,
    tracks: Array<Track>,
    playback: PlaybackState
}

const DEFAULT_STATE: AppState = {
    bpm: 120,
    playback: { playing: false, step: -1 },
    tracks: [ 
        createTrack("kick", [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false]),
        createTrack("hat", [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false]),
        createTrack("snare", [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false])
    ]
}

function createTrack(name: string, notes: Array<boolean>): Track {
    return { name: name, notes: notes.map((enabled) => { return { enabled: enabled, active: false }}) };
}