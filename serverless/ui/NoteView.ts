namespace UI {
    export class NoteView implements View {
        private _on: boolean = false;
        private _active: boolean = false;

        element: HTMLDivElement = document.createElement("div");
        private button: HTMLButtonElement = document.createElement("button");

        constructor(on: boolean, active: boolean) {
            this._on = on;
            this._active = active;

            this.element.className = "column note";
            this.button.className = this.renderClass();

            this.element.appendChild(this.button);
        }

        set active(active: boolean) {
            this._active = active;
            this.button.className = this.renderClass();
        }

        private renderClass = () => {
            if(this._active && this._on) {
                return "button";
            } else if(this._on) {
                return "button note-on";
            } else {
                return "button note-off";
            }
        }
    }
}