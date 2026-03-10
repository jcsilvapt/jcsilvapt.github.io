$(document).ready(function() {
	
	setTimeout(function(){
		$('body').addClass('loaded');
		$('h1').css('color','#222222');
	}, 3000);
	setTimeout(function () {
		$('.dot').text("Welcome");
		setTimeout(function () {
			fadeout()
		}, 450);
	}, 2500);
});

function fadeout() {
	document.getElementById('fadeout').style.opacity = '0';
}