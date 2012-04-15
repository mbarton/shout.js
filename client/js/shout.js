var secondsPerBeat = 0.42857;


var cursor = 0;
var timerId = -1;
var room = -1;

function setBPM(bpm)
{
	secondsPerBeat = 1.0 / (bpm / 60.0);
}

function play()
{	
	playStep();
	renderCursor();

	//console.log(cursor, matrix[0]["triggers"].length - 1);
	if(cursor == matrix[0]["triggers"].length - 1)
	{
		cursor = 0;
	}
	else
	{
		cursor++;
	}

	timerId = setTimeout(play, (secondsPerBeat / 4.0) * 1000.0);
}

function stop()
{
	clearTimeout(timerId);
	reset();
}

function reset()
{
	cursor = 0;
	// TODO: move me to UI
	$(".trigger").removeClass("triggered");
}

function handleUpdate(sample, step, isEnabled)
{
	var doRender = false;

	for(var i = 0; i < matrix.length; i++)
	{
		row = matrix[i];
		if(row["sample"] === sample)
		{
			if(row["triggers"][step] !== isEnabled)
			{
				row["triggers"][step] = isEnabled;
				doRender = true;
			}
		}
	}

	if(doRender)
		renderFromMatrix();
}

function handleInstrumentUpdate(index, sample)
{
	matrix[index].sample = sample;
	renderFromMatrix();
}

function handlePusherChange(data)
{
	var sample = data["sample"];
	var step = parseInt(data["position"]);
	var isEnabled = data["enabled"] === "true" ? true : false;
	
	handleUpdate(sample, step, isEnabled);
}

function handlePusherPlayback(data)
{
	var instruction = data["state"];

	if(instruction === "start")
	{
		play();
	}
	else if(instruction == "stop")
	{
		stop();
	}
}

function handlePusherTempo(data)
{
	var tempo = data["tempo"];
	if(tempo !== undefined)
	{
		var tempo = parseInt(data["tempo"]);
		if(tempo > 60 && tempo < 200)
		{
			setBPM(tempo);
			$("#tempo").val(tempo);
			$("#tempo").parent().removeClass("error");
		}
	}
}

function handleTwilioUpdate(data)
{
	var sample_path = data["url"];
	var sample_id = data["id"];

	samples.push({"id": sample_id, "path": sample_path});

	console.log("Twilio update: " + sample_path + " , " + sample_id);

	renderSampleChooser();

	// var newRowTriggers = new Array();
	// for(var i = 0; i < patternLength; i++)
	// 	newRowTriggers[i] = false;

	// var newRow = {"sample": sample_id, "path": sample_path, "triggers": newRowTriggers};

	// matrix[matrix.length] = newRow;
}

function pushPusherUpdate(sample, step, isEnabled)
{
	var url = pusher_endpoint() + "/" + room + "/" + sample + "/" + step + "/" + isEnabled;
	$.get(url);
}

function pushPusherPlayback(instruction, tempo)
{
	var url = pusher_playback_endpoint() + "/" + room + "/" + instruction;
	$.get(url);
}

function pushPusherTempo(tempo)
{
	var url = pusher_tempo_endpoint() + "/" + room + "/" + tempo;
	$.get(url);
}

function loadMatrix(callback)
{
	var url = image_endpoint() + "/" + room + "/?callback=?";
	
	$.ajax({
		url: url,
		dataType: "jsonp",
		success: function(data)
		{
			var errorMsg = verifyMatrix(data);
			if(errorMsg === undefined)
			{
				matrix = data;
				callback();
			}
			else
			{
				logError(errorMsg);
			}
		},
		error: function(data)
		{
			logError("Unable to load room from the server");
		}
	});
}

var room = window.location.hash.replace("#", "");

$(function(){
	$("#tempo").change(function(){
		var bpm = parseInt($(this).val());
		if(bpm > 60 && bpm < 200)
		{
			setBPM(bpm);
			pushPusherTempo(bpm);
			console.log(secondsPerBeat);
			$(this).parent().removeClass("error");
		}
		else
		{
			$(this).parent().addClass("error");
		}
	});

	$(".trigger").live("click", function()
	{
		var instrument = $(this).parent().children(".label").html();
		var index = $(this).parent().children(".trigger").index(this);
		var isEnabled = !$(this).hasClass("enabled");
		handleUpdate(instrument, index, isEnabled);
		pushPusherUpdate(instrument, index, isEnabled);
	});

	$("#play").click(function(){
		//play();
		pushPusherPlayback("start");
	});

	$("#stop").click(function(){
		//stop();
		pushPusherPlayback("stop");
	});

	$("a.change_sample").live("click", function(){
		var sample = $(this).html();
		var parentLabel = $(this).parent().parent().parent().parent();
		var index = $(".label").index(parentLabel) - 2;
		console.log(index, sample);
		handleInstrumentUpdate(index, sample);
	});

	$("#add_track").click(function(){
		var sample = $(".dropdown-toggle").html();
		var triggers = [];
		for(var i = 0; i < matrix[0].triggers.length; i++)
		{
			triggers.push(false);
		}
		matrix.push({"sample": sample, "triggers": triggers});
		renderFromMatrix();
	});

	$(".sample-chooser").live("click", function(){
		var sample = $(this).html();
		var dropper = $(this).parent().parent().parent();
		dropper.children(".dropdown-toggle").html(sample);
	});

	// loadMatrix(function()
	// {
		renderSampleChooser();
		renderFromMatrix();
		loadAudio();
	// });
	logInfo();
});