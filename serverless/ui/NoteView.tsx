namespace UI {
    export const NoteView = ({ note, ix, reactor }: { note: Note, ix: [number, number], reactor: Reactor }) => {
        const toggleFn = () => {
            const [trackIx, noteIx] = ix;
            reactor.dispatch({ track: trackIx, note: noteIx, enabled: !note.enabled });
        }

        return <div className="column note">
            <button className={noteClass(note)} onClick={toggleFn} />
        </div>;
    }

    function noteClass(note: Note): string {
        if(note.active && note.enabled) {
            return "button";
        } else if(note.enabled) {
            return "button note-on";
        } else {
            return "button note-off";
        }
    }

    // export class NoteView implements View {
    //     private _on: boolean = false;
    //     private _active: boolean = false;

    //     element: HTMLDivElement = document.createElement("div");
    //     private button: HTMLButtonElement = document.createElement("button");

    //     constructor(on: boolean, active: boolean, updateFn: () => void) {
    //         this._on = on;
    //         this._active = active;

    //         this.element.className = "column note";
    //         this.button.className = this.renderClass();

    //         this.button.onclick = updateFn;
    //         this.element.appendChild(this.button);
    //     }

    //     set on(on: boolean) {
    //         this._on = on;
    //         this.button.className = this.renderClass();
    //     }

    //     set active(active: boolean) {
    //         this._active = active;
    //         this.button.className = this.renderClass();
    //     }

    //     private renderClass = () => {
    //         if(this._active && this._on) {
    //             return "button";
    //         } else if(this._on) {
    //             return "button note-on";
    //         } else {
    //             return "button note-off";
    //         }
    //     }
    // }
}