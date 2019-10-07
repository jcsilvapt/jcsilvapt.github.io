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

// Cache selectors
var lastId,
	topMenu = $("#mainNav"),
	topMenuHeight = topMenu.outerHeight()+1,
	// All list items
	menuItems = topMenu.find("a"),
	// Anchors corresponding to menu items
	scrollItems = menuItems.map(function(){
		var item = $($(this).attr("href"));
		if (item.length) { return item; }
	});


// Bind click handler to menu items
// so we can get a fancy scroll animation
menuItems.click(function(e){
	var href = $(this).attr("href"),
		offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1;
	$('html, body').stop().animate({
		scrollTop: offsetTop
	}, 850);
	e.preventDefault();
});

// Bind to scroll
$(window).scroll(function(){
	// Get container scroll position
	var fromTop = $(this).scrollTop()+topMenuHeight;

	// Get id of current scroll item
	var cur = scrollItems.map(function(){
		if ($(this).offset().top < fromTop)
			return this;
	});
	// Get the id of the current element
	cur = cur[cur.length-1];
	var id = cur && cur.length ? cur[0].id : "";

	if (lastId !== id) {
		lastId = id;
		// Set/remove active class
		menuItems
			.parent().removeClass("active")
			.end().filter("[href=\\#"+id+"]").parent().addClass("active");
	}
});