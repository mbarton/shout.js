interface Track {
    sampleName: string,
    sample?: AudioBuffer,
    notes: Array<boolean>
}

interface AppState {
    tracks: Array<Track>,
    step: number,
    playing: boolean,
    bpm: number
}

// ludicrous language with bad support for immutable data
namespace ModelHelpers {
    export function updateTrack(track: number, before: AppState, fn: (Track) => void): AppState {
        const oldTrack = before.tracks[track];
        
        const newTrack = Object.assign({}, oldTrack);
        const newNotes = oldTrack.notes.slice();
        newTrack.notes = newNotes;

        fn(newTrack);

        const newTracks = before.tracks.slice();
        newTracks[track] = newTrack;

        const newState = Object.assign({}, before);
        newState.tracks = newTracks;

        return newState;
    }
}

const DEFAULT_STATE: AppState = {
    playing: false,
    step: -1,
    bpm: 120,
    tracks: [ 
        { sampleName: "kick", notes: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
        { sampleName: "hat", notes: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false] },
        { sampleName: "snare", notes: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] }
    ]
}