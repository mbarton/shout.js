class Shout {
    state: AppState;
    millisPerStep: number;

    transport: UI.TransportView;
    tracks: Array<UI.TrackView>;

    constructor() {
        this.state = DEFAULT_STATE;
        this.millisPerStep = audio.millisPerStep(this.state.bpm);

        this.transport = new UI.TransportView(this.togglePlayback);
        this.tracks = this.state.tracks.map((track, ixTrack) => {
            const updateFn = (ixNote: number) => this.toggleNote(ixTrack, ixNote);
            return new UI.TrackView(track, updateFn);
        });

        this.loadTracks();
        this.mountViews();
    }

    loadTracks = () => {
        this.state.tracks.forEach(( { name }, track) => {
            audio.loadSample(name).then((sample) => {
                this.state.tracks[track].sample = sample;
            });
        });
    }

    mountViews = () => {
        const base = document.querySelector(".container");
        base.appendChild(this.transport.element);

        this.tracks.forEach((track) => {
            base.appendChild(track.element);
        });
    }

    toggleNote = (ixTrack: number, ixNote: number) => {
        const track = this.state.tracks[ixTrack];
        const trackView = this.tracks[ixTrack];

        track.notes[ixNote] = !track.notes[ixNote];
        trackView.notes[ixNote].on = track.notes[ixNote];
    }

    togglePlayback = () => {
        this.state.playing = !this.state.playing;
        this.transport.playing = this.state.playing;

        this.tracks.forEach((track) => {
            track.notes.forEach((note) => {
                note.active = false;
            });
        });

        if(this.state.playing) {
            this.step();
        } else {
            this.state.step = -1;
        }
    }

    step = () => {
        if(this.state.playing) {
            const stepBefore = this.state.step; 
            const stepNow = stepBefore == -1 ? 0 : (stepBefore + 1) % 16;

            for(let i = 0; i < this.state.tracks.length; i++) {
                const trackView = this.tracks[i];
                const track = this.state.tracks[i];

                if(stepBefore != -1) {
                    trackView.notes[stepBefore].active = false;
                }

                trackView.notes[stepNow].active = true;

                if(track.notes[stepNow]) {
                    audio.playSample(track.sample);
                }
            }

            this.state.step = stepNow;
            setTimeout(this.step, this.millisPerStep);
        }
    }
}
