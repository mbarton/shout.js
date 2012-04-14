var secondsPerBeat = 0.42857;

var matrix = [
	[true, false, false, false, true, false, false, false, true, false, false, false],
	[false, false, true, false, false, false, true, false, false, false, true, false],
	[false, false, false, false, true, false, false, false, true, false, false, false],
	[true, false, false, false, false, false, false, false, false, false, false, false]
];

var cursor = 0;
var timerId = -1;

function setBPM(bpm)
{
	secondsPerBeat = 1.0 / (bpm / 60.0);
}

function play()
{
	var triggers = $(".trigger");
	triggers.removeClass("triggered");
	
	if(cursor == 12)
	{
		cursor = 0;
	}

	c = cursor;

	while(c < triggers.length)
	{
		$(triggers[c]).addClass("triggered");

		c += 12;
	}

	cursor++;

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
	$(".trigger").removeClass("triggered");
}

function renderMatrix()
{
	var x = 0;
	var y = 0;
	$(".trigger").each(function(){
		if(matrix[y][x])
		{
			$(this).addClass("enabled");
		}
		else
		{
			$(this).removeClass("enabled");
		}
		if(x >= 11)
		{
			x = 0;
			y++;
		}
		else
		{
			x++;
		}
	});
}

$(function(){
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

	renderMatrix();
});