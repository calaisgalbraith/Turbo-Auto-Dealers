"use strict"

// scroll to top 
$(window).scroll(function() {
    if ($(this).scrollTop()) {
        $("#backToTopBtn").css("display", "block");;
    } else {
        $("#backToTopBtn").css("display", "none");
    }
});

$('#backToTopBtn').click(() => {
    window.scrollTo(0, 0);
})