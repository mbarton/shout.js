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
Pusher.log = function(message)
{
	console.log(message);
}

WEB_SOCKET_DEBUG = true;

var pusher = new Pusher(pusher_key());
var channel = pusher.subscribe("test_channel");
channel.bind("an_event", function(data){
	alert(data);
});