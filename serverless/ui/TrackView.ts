namespace UI {
    export class TrackView implements View {
        notes: Array<NoteView> = [];
        element: HTMLDivElement = document.createElement("div");

        constructor(track: Track) {
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

            notes.forEach((note) => {
                const view = new NoteView(note, false);
                
                this.notes.push(view);
                notesParent.appendChild(view.element);
            });

            this.element.appendChild(notesElem);
        }
    }
}