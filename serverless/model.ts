interface Track {
    name: string,
    sample?: AudioBuffer,
    notes: Array<boolean>
}

interface AppState {
    tracks: Array<Track>,
    step: number,
    playing: boolean,
    bpm: number
}

const DEFAULT_STATE: AppState = {
    playing: false,
    step: -1,
    bpm: 120,
    tracks: [ 
        { name: "kick", notes: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
        { name: "hat", notes: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false] },
        { name: "snare", notes: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] }
    ]
}