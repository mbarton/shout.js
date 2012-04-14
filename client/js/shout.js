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

	//console.log(cursor, patternLength);
	if(cursor == patternLength - 1)
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

function handlePusherUpdate(data)
{
	var sample = data["sample"];
	var step = parseInt(data["position"]);
	var isEnabled = data["enabled"] === "true" ? true : false;
	
	handleUpdate(sample, step, isEnabled);
}

function pushPusherUpdate(sample, step, isEnabled)
{
	var url = pusher_endpoint() + "/" + room + "/" + sample + "/" + step + "/" + isEnabled;
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
				patternLength = matrix[0].length;
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

$(function(){
	room = window.location.hash.replace("#", "");

	$("#tempo").change(function(){
		var bpm = parseInt($(this).val());
		if(bpm > 60 && bpm < 200)
		{
			setBPM($(this).val());
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
		play();
	});

	$("#stop").click(function(){
		stop();
	});

	loadMatrix(function()
	{
		renderFromMatrix();
		loadAudio();
	});
	logInfo();
});