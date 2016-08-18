namespace UI {
    export class TrackView implements View {
        notes: Array<NoteView> = [];
        element: HTMLDivElement = document.createElement("div");
        toggleNote: (number) => void;

        constructor(track: Track, toggleNote: (number) => void) {
            this.toggleNote = toggleNote;
            this.element.className = "row";
            this.buildName(track.name);
            this.buildNotes(track.notes);
        }

        private buildName = (name: string) => {
            const nameElem = document.createElement("div");
            nameElem.className = "column column-10";
            nameElem.innerHTML = `<strong>${name}</strong>`;

            this.element.appendChild(nameElem);
        }

        private buildNotes = (notes: Array<boolean>) => {
            const notesElem = document.createElement("div");
            notesElem.className = "column column-90";

            const notesParent = document.createElement("div");
            notesParent.className = "row";
            notesElem.appendChild(notesParent);

            notes.forEach((note, ix) => {
                const updateFn = () => this.toggleNote(ix);
                const view = new NoteView(note, false, updateFn);
                
                this.notes.push(view);
                notesParent.appendChild(view.element);
            });

            this.element.appendChild(notesElem);
        }
    }
}