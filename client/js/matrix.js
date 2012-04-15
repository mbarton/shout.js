var matrix = [
	{"sample": "kick", "path": "samples/kick.mp3",
	 "triggers": [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false]},
	{"sample": "hat", "path": "samples/hat.mp3",
	 "triggers": [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false]},
	{"sample": "snare", "path": "samples/snare.mp3",
	 "triggers": [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]},
	{"sample": "crash", "path": "samples/crash.mp3",
	 "triggers": [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]}
];

var patternLength = matrix[0]["triggers"].length;
// var matrix = [];
// var patternLength = 0;

var samples = [
	{"id": "fake", "path": "lol"}
	// {"id": "kick", "path": "samples/kick.mp3"},
	// {"id": "hat", "path": "samples/hat.mp3"},
	// {"id": "snare", "path": "samples/snare.mp3"},
	// {"id": "crash", "path": "samples/crash.mp3"},
];
//var samples = [];

function verifyMatrix(matrix)
{
	if(matrix.length === 0)
		return "Error loading tracks: Zero length matrix";

	for(var i = 0; i < matrix.length; i++)
	{
		var row = matrix[i];
		if(row.sample === undefined)
		{
			return "Error loading tracks: undefined sample for track " + i;
		}
		if(row.triggers === undefined)
		{
			return "Error loading tracks: no steps defined for track " + i;
		}
		if(row.triggers.length === 0)
		{
			return "Error loading tracks: zero steps for track " + i;
		}
	}

	return undefined;
}