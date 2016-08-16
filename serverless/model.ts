interface Track {
    sample: string,
    notes: Array<boolean>
}

interface AppState {
    tracks: Array<Track>,
    playbackState: string
}

const DEFAULT_STATE: AppState = {
    playbackState: "loading",
    tracks: [ 
        { sample: "kick", notes: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
        { sample: "snare", notes: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] },
    ]
}