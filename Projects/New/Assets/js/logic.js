(function () {
    var quotes = $(".quotes");
    var quoteIndex = -1;
  
    function showNextQuote() {
      ++quoteIndex;
      quotes
        .eq(quoteIndex % quotes.length)
        .fadeIn(1000)
        .delay(1000)
        .fadeOut(1000, showNextQuote);
    }
  
    showNextQuote();
  })();

  /*
  (function($) {
    $(document).ready(function() {
  
      // hide .navbar first
      $(".navbar").hide();
  
      // fade in .navbar
      $(function() {
        $(window).scroll(function() {
          // set distance user needs to scroll before we fadeIn navbar
          if ($(this).scrollTop() > 100) {
            $('.navbar').fadeIn();
          } else {
            $('.navbar').fadeOut();
          }
        });
  
  
      });
  
    });
  }(jQuery));*/

function showNextPage(nextPage) {
    var pageTop = document.getElementById(nextPage).offsetTop;
    window.scrollTo(0, pageTop);
}


var lastDiv = null;

function ToggleInfo(div) {
  
  if(lastDiv === null) {
    div.querySelector('.content').classList.toggle('expand');
    lastDiv = div;
  }else {
    if(lastDiv === div) {
      div.querySelector('.content').classList.toggle('expand');
      lastDiv = null;
    } else {
      div.querySelector('.content').classList.toggle('expand');
      lastDiv.querySelector('.content').classList.toggle('expand');
      lastDiv = div;
    }
  }
}