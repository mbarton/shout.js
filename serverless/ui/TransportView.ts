namespace UI {
    export class TransportView implements View {
        private _playing: boolean = false;

        element: HTMLDivElement = document.createElement("div");
        private button = document.createElement("a");
        private icon = document.createElement("i");

        constructor(togglePlayback: () => void) {
            this.button.className = "item";
            this.button.onclick = togglePlayback;

            this.icon.className = this.iconClass();
            this.element.innerHTML = this.template();

            this.button.appendChild(this.icon);
            this.element.querySelector(".right.menu").appendChild(this.button);
        }

        private iconClass = () => {
            const iconImage = this._playing ? "stop circle" : "video play";
            return `large ${iconImage} icon`;
        }

        private template = () => {
            return `
                <div class="ui menu">
                    <div class="header item">
                        shout
                    </div>
                    <div class="right menu">
                    </div>
                </div>
            `;
        }
    }
}