namespace UI {
    export class TransportView implements View {
        private _playing: boolean = false;

        element: HTMLDivElement = document.createElement("div");
        
        private playButton = document.createElement("button");
        private playIcon = document.createElement("i");

        private shareButton = document.createElement("button");
        private connectButton = document.createElement("button");

        constructor(togglePlayback: () => void, startShare: () => void) {
            this.element.innerHTML = this.template();

            this.playButton.className = "button icon-button";
            this.playButton.onclick = togglePlayback;
            this.playIcon.className = this.iconClass();
            this.playButton.appendChild(this.playIcon);

            this.shareButton.className = "button icon-button";
            this.shareButton.innerHTML = "SHARE";
            this.shareButton.onclick = startShare;

            this.connectButton.className = "button icon-button";
            this.connectButton.innerHTML = "CONNECT";

            this.element.querySelector(".play-wrapper").appendChild(this.playButton);
            this.element.querySelector(".share-wrapper").appendChild(this.shareButton);
            this.element.querySelector(".connect-wrapper").appendChild(this.connectButton);
        }

        set playing(playing: boolean) {
            this._playing = playing;
            this.playIcon.className = this.iconClass();
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
                    <div class="column column-33 float-right">
                        <div class="row">
                            <div class="column play-wrapper"></div>
                            <div class="column share-wrapper"></div>
                            <div class="column connect-wrapper"></div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}