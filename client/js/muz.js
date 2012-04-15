var audioContext = new webkitAudioContext();

function decodeAudio(index, response)
{
	audioContext.decodeAudioData(response, function(buf)
	{
		console.log("Decoded " + index);
		matrix[index]["buffer"] = buf;
	});
}

function loadSample(index, path)
{
	if(matrix[index].buffer === undefined)
	{
		var request = new XMLHttpRequest();
		request.onload = function(args)
		{
			console.log("Downloaded " + index);
			decodeAudio(index, args.target.response);
		}
		request.onerror = function(args)
		{
			logError("Unable to download sample " + matrix[index]["sample"]);
		}
		request.open('GET', path, true);
		request.responseType = 'arraybuffer';
		request.send();
	}
}

function loadAudio()
{
	for(var i = 0; i < matrix.length; i++)
	{
		loadSample(i, matrix[i].path);
	}
}

function playStep()
{
	var players = $("audio");
	for(var i = 0; i < matrix.length; i++)
	{
		if(matrix[i]["triggers"][cursor] && matrix[i].buffer)
		{
			source = audioContext.createBufferSource();
			source.buffer = matrix[i]["buffer"];
			source.connect(audioContext.destination);
			source.noteOn(0);
		}
	}
}