$(document).ready(function() {
	
	setTimeout(function(){
		$('body').addClass('loaded');
		$('h1').css('color','#222222');
	}, 3000);
	
});

document.ontouchstart = function(){ document.getElementById('wp').play(); }
var navActive = false;
var aHeight = 100;

$('.navbar-effect').css({height:"100px"});
$(window).scroll(function () {
	if ($(document).scrollTop() > 100) {
		if(!navActive) {
			$('.navbar-effect').css({height: "60px"});
		}
		aHeight = 60;
	} else {
		if (!navActive) {
			$('.navbar-effect').css({height: "100px"});
		}
		aHeight = 100;
	}
});

$(document).ready(function () {
	$('[data-toggle="tooltip"]').tooltip();

});
$(document).on('click', '.navbar-toggler', function () {
	if(!navActive) {
		navActive = true;
		$('.navbar-effect').css({height: "initial"});
	} else {
		navActive = false;
		$('.navbar-effect').css({height: aHeight+"px"});
	}
});