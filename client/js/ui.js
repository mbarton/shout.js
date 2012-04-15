function generateSampleSelecter(sample)
{
	// var ret = "<div class=\"label span1\">";
	// ret += "<div class=\"btn-group\">";
	// ret += "<a class=\"btn dropdown-toggle\" data-toggle=\"dropdown\" href=\"#\">"
	// ret += "" + sample + "<span class=\"caret\"></span>";
	// ret += "</a>";
	// ret += "<ul class=\"dropdown-menu\">";
	// for(var i = 0; i < samples.length; i++)
	// {
	// 	var sample = samples[i];
	// 	ret += "<li><a class=\"change_sample\" href=\"#\">" + sample["id"] + "</a></li>";
	// }
	// ret += "<li class=\"divider\"></li><a href=\"#\">Remove</a>";
	// ret += "</ul>";
	// ret += "</div></div>";
	// return ret;
	var ret = "<div class=\"label span1\">";
	ret += sample;
	ret += "</div>";
	return ret;
}

function generateRow(sample, arr)
{
	var ret = "<div id=\"push_down\" class=\"track row\">";
	ret += generateSampleSelecter(sample);
	if(arr === undefined)
	{
		for(var i = 0; i < matrix[0]["triggers"].length; i++)
		{
			ret += "<div class=\"trigger span1\">&nbsp;</div>";
		}
	}
	else
	{
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

function renderSampleChooser()
{
	$(".dropdown-toggle").html("" + samples[0].id);
	$(".dropdown-menu").html("");
	for(var i = 0; i < samples.length; i++)
	{
		$(".dropdown-menu").append("<li><a class=\"sample-chooser\" href=\"#\">" + samples[i].id + "<a/></li>");
	}
}

function logInfo(msg)
{
	if(msg === undefined)
	{
		$(".error_report .label-success").hide();
	}
	else
	{
		$(".error_report .label-success").html(msg);
		$(".error_report .label-success").show();
	}
}

function logError(msg)
{
	if(msg === undefined)
	{
		$(".error_report .label-important").hide();
	}
	else
	{
		$(".error_report .label-important").html(msg);
		$(".error_report .label-important").show();
	}
}