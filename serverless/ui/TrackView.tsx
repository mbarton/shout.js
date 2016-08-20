namespace UI {
    export const TrackView = ({ track, trackIx, reactor }: { track: Track, trackIx: number, reactor: Reactor }) => {
        const notes = track.notes.map((note, ix) => {
            return <NoteView key={ix} note={note} ix={[trackIx, ix]} reactor={reactor} />
        });

        return <div className="row">
            <div className="column column-10">
                <strong>{track.name}</strong>
            </div>
            <div className="column column-90">
                <div className="row">
                    {notes}
                </div>
            </div>
        </div>;
    }

    // export class TrackView implements View {
    //     notes: Array<NoteView> = [];
    //     element: HTMLDivElement = document.createElement("div");
    //     toggleNote: (number) => void;

    //     constructor(track: Track, toggleNote: (number) => void) {
    //         this.toggleNote = toggleNote;
    //         this.element.className = "row";
    //         this.buildName(track.name);
    //         this.buildNotes(track.notes);
    //     }

    //     private buildName = (name: string) => {
    //         const nameElem = document.createElement("div");
    //         nameElem.className = "column column-10";
    //         nameElem.innerHTML = `<strong>${name}</strong>`;

    //         this.element.appendChild(nameElem);
    //     }

    //     private buildNotes = (notes: Array<boolean>) => {
    //         const notesElem = document.createElement("div");
    //         notesElem.className = "column column-90";

    //         const notesParent = document.createElement("div");
    //         notesParent.className = "row";
    //         notesElem.appendChild(notesParent);

    //         notes.forEach((note, ix) => {
    //             const updateFn = () => this.toggleNote(ix);
    //             const view = new NoteView(note, false, updateFn);
                
    //             this.notes.push(view);
    //             notesParent.appendChild(view.element);
    //         });

    //         this.element.appendChild(notesElem);
    //     }
    // }
}