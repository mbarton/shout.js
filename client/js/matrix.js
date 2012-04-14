var matrix = [
	{"sample": "kick", "path": "samples/kick.mp3",
	 "triggers": [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false]},
	{"sample": "hat", "path": "samples/hat.mp3",
	 "triggers": [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false]},
	{"sample": "snare", "path": "samples/snare.mp3",
	 "triggers": [false, false, false, false, true, false, false, false, true, false, false, false, false, false, false, false]},
	{"sample": "crash", "path": "samples/crash.mp3",
	 "triggers": [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]}
];

var patternLength = matrix[0]["triggers"].length;