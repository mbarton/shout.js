interface Track {
    sample: string,
    notes: Array<boolean>
}

interface AppState {
    tracks: Array<Track>,
    playbackState: string
}

// ludicrous language with bad support for immutable data
namespace ModelHelpers {
    export function toggleNote(track: number, note: number, before: AppState): AppState {
        const oldTrack = before.tracks[track];
            
        const newNotes = oldTrack.notes.slice();
        newNotes[note] = !newNotes[note];

        const newTrack = Object.assign({}, oldTrack);
        newTrack.notes = newNotes;
        
        const newTracks = before.tracks.slice();
        newTracks[track] = newTrack;

        const newState = Object.assign({}, before);
        newState.tracks = newTracks;

        return newState;
    }
}

const DEFAULT_STATE: AppState = {
    playbackState: "loading",
    tracks: [ 
        { sample: "kick", notes: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
         { sample: "hat", notes: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false] },
        { sample: "snare", notes: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] }
    ]
}