var audioContext = new webkitAudioContext();

function decodeAudio(index, response)
{
	audioContext.decodeAudioData(response, function(buf)
	{
		console.log("Decoded " + index);
		matrix[index]["buffer"] = buf;
	});
}

function loadAudio()
{
	// Value types, value types my kingdom for some value types!
	// This only works by black magic, soz
	requests = []
	for(var i = 0; i < matrix.length; i++)
	{
		if(matrix[i]["buffer"] === undefined)
		{
			requests[i] = new XMLHttpRequest();
			
			requests[i].onload = function(args)
			{
				for(var i = 0; i < requests.length; i++)
				{
					if(requests[i] === args.target)
					{
						console.log("Downloaded " + i);
						decodeAudio(i, args.target.response);
					}
				}
			}

			requests[i].onerror = function(args)
			{
				logError("Unable to download sample " + matrix[i]["sample"]);
			}

			requests[i].open('GET', matrix[i]["path"], true);
			requests[i].responseType = 'arraybuffer';
			requests[i].send();
		}
	}
}

function playStep()
{
	var players = $("audio");
	for(var i = 0; i < matrix.length; i++)
	{
		if(matrix[i]["triggers"][cursor])
		{
			source = audioContext.createBufferSource();
			source.buffer = matrix[i]["buffer"];
			source.connect(audioContext.destination);
			source.noteOn(0);
		}
	}
}