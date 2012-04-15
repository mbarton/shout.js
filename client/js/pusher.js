// // Enable pusher logging - don't include this in production
// Pusher.log = function(message) {
//      if (window.console && window.console.log)
// 	{window.console.log(message);
// };
// Flash fallback logging - don't include this in production
//    WEB_SOCKET_DEBUG = true;
//    var pusher = new Pusher('79a35f6a8db88187adb6');
//    var channel = pusher.subscribe('test_channel');
//    channel.bind('my_event', function(data) {
//      alert(data);
//    });
var room = window.location.hash.replace("#", "");

Pusher.log = function(message)
{
	console.log(message);
}

WEB_SOCKET_DEBUG = true;

var pusher = new Pusher(pusher_key());
var channel = pusher.subscribe(room);
channel.bind("change", function(data){
	handlePusherChange(data);
});

channel.bind("playback", function(data)
{
	handlePusherPlayback(data);
});

channel.bind("tempo", function(data)
{
	handlePusherTempo(data);
});

channel.bind("newsample", function(data)
{
	handlePusherNewSample(data);
})

var twilio_channel_name = "twilio"
console.log("Subscribing to Pusher channel: " + twilio_channel_name);
var twilio_channel = pusher.subscribe( twilio_channel_name );
twilio_channel.bind("twilio_event", function(data)
{
	handleTwilioUpdate(data);
});
