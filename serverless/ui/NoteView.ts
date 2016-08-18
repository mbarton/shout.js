namespace UI {
    export class NoteView implements View {
        private _on: boolean = false;
        private _active: boolean = false;

        element: HTMLDivElement = document.createElement("div");
        private button: HTMLButtonElement = document.createElement("button");

        constructor(on: boolean, active: boolean) {
            this._on = on;
            this._active = active;

            this.element.className = "one wide column";
            this.button.className = this.renderClass();

            this.element.appendChild(this.button);
        }

        set active(active: boolean) {
            this._active = active;
            this.button.className = this.renderClass();
        }

        private renderClass = () => {
            if(this._active) {
                return "ui positive button";
            } else if(this._on) {
                return "ui button active";
            } else {
                return "ui button";
            }
        }
    }
}