namespace UI {
    export class TransportView implements View {
        private _playing: boolean = false;

        element: HTMLDivElement = document.createElement("div");
        private button = document.createElement("button");
        private icon = document.createElement("i");

        constructor(togglePlayback: () => void) {
            this.button.className = "button play";
            this.button.onclick = togglePlayback;

            this.icon.className = this.iconClass();
            this.element.innerHTML = this.template();

            this.button.appendChild(this.icon);
            this.element.querySelectorAll(".column")[1].appendChild(this.button);
        }

        set playing(playing: boolean) {
            this._playing = playing;
            this.icon.className = this.iconClass();
        }

        private iconClass = () => {
            const iconImage = this._playing ? "fa-stop-circle" : "fa-play-circle";
            return `fa ${iconImage} icon`;
        }

        private template = () => {
            return `
                <div class="row">
                    <div class="column">
                        <h3>shout</h3>
                    </div>
                    <div class="column column-10 float-right">
                    </div>
                </div>
            `;
        }
    }
}