function generateRow(sample, arr)
{
	var ret = "<div id=\"push_down\" class=\"track row\">";
	ret += "<div class=\"label span1\">" + sample + "</div>";
	for(var i = 0; i < arr.length; i++)
	{
		if(arr[i])
		{
			ret += "<div class=\"trigger span1 enabled\">&nbsp;</div>";
		}
		else
		{
			ret += "<div class=\"trigger span1\">&nbsp;</div>";
		}
	}
	ret += "</div>";
	return ret;
}

function renderCursor()
{
	$(".trigger").removeClass("triggered");
	$(".track").each(function()
	{
		$($(this).children(".trigger")[cursor]).addClass("triggered");
	});
}

function renderFromMatrix()
{
	var x = 0;
	var temp = "";
	$(".trigger").removeClass("enabled");
	for(var y = 0; y < matrix.length; y++)
	{
		temp += generateRow(matrix[y]["sample"], matrix[y]["triggers"]);
	}
	$("#sequencer").html(temp);
}