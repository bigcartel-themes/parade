var inPreview = (/\/admin\/design/.test(top.location.pathname));

$(document).ready(function(event) {
	if ($('.intro-overlay').length) {
		var $this = $('.intro-overlay');
		$('.intro-overlay').delay(600).removeClass('preload').delay(500).queue(function(next) {
			$('.intro-overlay .intro-text').fadeIn(300, function() {
				$(this).stop();
				$this.stop().delay(500).fadeOut(600, function() { 
  				$('.product-card').fadeIn(300);
				});
			});																	  
		});
	}
});

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};

if ($('.flash-message-text').length) {
  var announcementMessage = $('.flash-message-text').html();
  var hashedMessage = announcementMessage.hashCode();
  var cookieValue = getCookie('hide-announcement-message');
  if (cookieValue) {
    if (cookieValue != hashedMessage) {
      $('body').addClass('has-flash-message');
    }
  }
  else { 
    $('body').addClass('has-flash-message');
  }
} 
        
function setCookie(name,value,days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function eraseCookie(name) {   
  document.cookie = name+'=; Max-Age=-99999999;';  
}

addProductCardSpacer = function(element) {
  var waypoint = new Waypoint({
    element: element,
    handler: function(direction) {
      if (direction == "up") { 
        $(element).prev().addClass('show-product-title');
      }
      if (direction == "down") { 
        $('.product-card').removeClass('show-product-title');
      }
    },
    offset: '50%'
  })
}

addProductCard = function(element) {
  var waypoint = new Waypoint({
    element: element,
    handler: function(direction) {
      if (direction == "up") { 
        $('.product-card').removeClass('show-product-title');
      }
      if (direction == "down") { 
        $('.product-card').removeClass('show-product-title');
        $(element).addClass('show-product-title');
      }
    },
    offset: '50%'
  })
}

$(".product-card").each(function(index, element) {
  var image = $(this).find('img');
  var img = new Image();
  img.src = image.attr('src');
  img.src = image.attr('src');
  img.onload = function() {
    addProductCard(element);
  }
});
$(".product-card-spacer").each(function(index, element) {
  addProductCardSpacer(element);
});

if ($('.next-button').length) { 
    $('.product-list').infiniteScroll({
    path: '.next-button',
    append: '.product-list li',
    hideNav: '.pagination',
    status: '.page-load-status',
    history: false,
    debug: false,
    scrollThreshold: 1600
  });
}

$('.product-list').on( 'append.infiniteScroll', function( event, response, path, items ) {
  $.each(items, function( index, value ) {
    var element = $(value);
    if (element.hasClass('product-card')) {
      addProductCard(value);
    }
    else { 
      addProductCardSpacer(value);
    }
  });
  setTimeout(function(){
    Waypoint.refreshAll();
  }, 1200);
});

var openOverlay = function(overlay_name) { 
  var scrollDiv = $('<div class="scrollbar-measure"></div>').appendTo(document.body)[0];
  var scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  var hamburger = $(overlay_name).find('.hamburger');
  $(overlay_name).addClass('show');
  if (!hamburger.hasClass('close-product-option-overlay')) { 
    hamburger.addClass('is-active'); 
  }
  if ($(window).height() < $(document).height()) {
    $(document.body).css('margin-right', scrollBarWidth + 'px');
  }
  $('body').addClass('overlay-open');
}

var closeOverlay = function(overlay_name) {
  var hamburger = $(overlay_name).find('.hamburger');
  if (!hamburger.hasClass('close-product-option-overlay')) { 
    hamburger.removeClass('is-active'); 
  }
  $(overlay_name).removeClass('show');
  $(document.body).css('margin-right', '');
  $('.scrollbar-measure').remove();
  $('body').removeClass('overlay-open');
}

$('.open-page-nav').click(function(e) {
  e.preventDefault();
  openOverlay('.page-nav-overlay');
});

$('.close-page-nav-overlay').click(function(e) { 
  e.preventDefault();
  closeOverlay('.page-nav-overlay');
});

$('.open-category-nav').click(function(e) {
  e.preventDefault();
  openOverlay('.category-nav-overlay');
});

$('.close-category-nav-overlay').click(function(e) { 
  e.preventDefault();
  closeOverlay('.category-nav-overlay');
});

$('.close-product-option-overlay').click(function(e) { 
  e.preventDefault();
  closeOverlay('.product-option-overlay');
});

$('.flash-message-close').click(function(e) { 
  $('.flash-message').slideUp('fast', function() { 
    $('body').removeClass('has-flash-message');
    setCookie('hide-announcement-message',hashedMessage,7);
  });
})

$('.add-to-cart-button').click(function(e) { 
  e.preventDefault();
  $('.product-form').submit()[0];
}); 

$('.select-option-button').click(function(e) { 
  e.preventDefault();
  openOverlay('.product-option-overlay');
});

$('.close-product-description-overlay').click(function(e) { 
  e.preventDefault();
  closeOverlay('.product-description-overlay');
});

$('body').addClass('pointer-device');

window.addEventListener('touchstart', function onFirstTouch() {
  $('body').addClass('touch-device');
  $('body').removeClass('pointer-device')
  window.removeEventListener('touchstart', onFirstTouch, false);
}, false);


function init() {
  window.addEventListener('scroll', function(e){
    var distanceY = window.pageYOffset || document.documentElement.scrollTop,
      shrinkOn = $('.flash-message').outerHeight(),
      elements = $('header');
    if (distanceY > shrinkOn) {
      elements.addClass('smaller');
    } else {
      if (elements.hasClass('smaller')) {
        elements.removeClass('smaller');
      }
    }
  });
}
window.onload = init();

function is_touch_device() {
  return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

if (is_touch_device()) {
  $('body').addClass('touch-device');
  $('body').removeClass('pointer-device');
}
else { 
  $('body').addClass('pointer-device');
}
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

var x = null;
var y = null;

function onMouseUpdate(e) {
  x = e.pageX;
  y = e.pageY;
  if (!$('body').hasClass('touch-device')) { 
    if (x && y) { 
      if (!$('body').hasClass('show-cursor')) { 
        $('body').addClass('show-cursor');
      }
    }
  }
}

function getMouseX() {
  return x;
}

function getMouseY() {
  return y;
}
var updateCursor = function() { 
  if ($('body').hasClass('show-cursor')) {
    if ($('.arrow').length) { 
      var $arrow = $('.arrow');
      var cursorWidth = $('.arrow').outerWidth() / 2;
      var cursorHeight = $('.arrow').outerHeight() / 2;
      if ($('.arrow-next').css('display') == 'block') { 
		    $('.arrow').offset({
		      'left': getMouseX() - 60,
		      'top': getMouseY() - cursorHeight
		    });
		  }
		  else { 
		  	$('.arrow').offset({
		  		'left': getMouseX(),
		  		'top': getMouseY() - cursorHeight
	  		});
		  }
    }
    var $cursor = $('.cursor');
    $('.cursor').css({
      'left': getMouseX() - 60 + 'px',
      'top': getMouseY() - 60 - $(document).scrollTop() + 'px'
    });
  }
}
$(document).mousemove(function(e) {
  updateCursor();
});

$('html').mouseleave(function(){
  $('body').removeClass('show-cursor');
});

cartShowing = false;

$(document).on('keyup',function(e) {
  if (e.keyCode == 27) {
    if (cartShowing) { 
      hideCart();
    }
    closeOverlay('.full-screen-overlay');
  }
});

$(document).on("click", ".cart-link", function(e) {
  if (!inPreview) { 
    e.preventDefault();
    var currentURL = window.location.href;
    var lastPart = currentURL.substr(currentURL.lastIndexOf('/') + 1);
    if (lastPart != 'cart') {
      showCart();
    }
  }
});
$(document).on('click', '.close-cart-overlay', function(e) {
  if ($("body").attr("id") != "cart") {
    e.preventDefault();
    hideCart();
  }
});

var hideCart = function() { 
  var $cart = $(".cart-holder");
  $('.dark-overlay').removeClass('visible');
  $cart.slideUp(300, function() {
    $(this).remove();
    cartShowing = false;
    $('body').removeClass('overlay-open');
  });
}

var showCart = function() { 
  var $container = $("<div>");
  $container.load("/cart?" + $.now() + " .cart-holder", function() {
    var $cart = $container.find(".cart-holder")
    $cart.css("display", "none");
    $('body').addClass('overlay-open');
    $('body').prepend($cart);
    $('.dark-overlay').addClass('visible');
    $cart.slideDown(200, function() { 
      cartShowing = true;
    });
  });
}

var productImageFit = function() {
  var productImagesElement = $('.product-images')[0];
  var objectFit = getComputedStyle( productImagesElement, ':before' ).content;
  if (objectFit == 'none') { 
    $('.product-image.fill img').each(function(){
      var imgSrc = $(this).attr('src');
      var fitType = 'cover';
      if ($(this).data('fit-type')) {
        fitType = $(this).data('fit-type');
      }
      $(this).parent().css({ 'background' : 'transparent url("'+imgSrc+'") no-repeat center center/'+fitType, });
      $(this).remove(); 
    });
  }
}
if ($('.product-images').length) { 
  productImageFit();
}

productImages = $('.multiple-product-images');
desktopProductImagesOptions = {
  accessibility: false,
  wrapAround: true,
  dragThreshold: 8,
  imagesLoaded: true,
  setGallerySize: true,
  adaptiveHeight: true
}
productImages.flickity(desktopProductImagesOptions);

$(window).on('resize', function() {
  productImages.flickity('resize');
});

$('.option-item:not(.sold-out)').click(function(e) { 
  var option_id = $(this).data("option-id");
  if (option_id > 0) { 
    $('.hidden-product-option').val(option_id);
    $('.product-form').submit()[0];
  }
});

if ($('.options-list').length) { 
  var selected_option = $('.options-list li:not(.sold-out):first');
  var option_id = selected_option.data('option-id');
  if (option_id > 0) { 
    $('.hidden-product-option').val(option_id);
    selected_option.addClass('selected');
  }
}

$('.product-form').submit(function(e) {
  e.preventDefault();
  var quantity = $(this).find(".product-quantity").val()
  , itemID = $(this).find("#option").val()
  , addButton = $('.add-to-cart-button')
  , addText = addButton.find('.status-text')
  , cursorText = $('.cursor-text-caption')
  , addTextValue = addText.html()
  , cursorTextValue = cursorText.html()
  , addedText = addButton.data('added-text')
  , addingText = addButton.data('adding-text')
  , cartLink = $(".cart-link");
  if (quantity > 0 && itemID > 0) {
    addText.html(addingText);
    cursorText.html(addingText);
    Cart.addItem(itemID, quantity, function(cart) { 
      closeOverlay('.product-option-overlay');
      cartLink.html(cart.item_count);
      cartLink.removeClass('hidden');
      cartLink.addClass('expanded');
      addText.html(addedText);
      cursorText.html(addedText);
      setTimeout(function(){
        cartLink.removeClass('expanded');
        addText.html(addTextValue);
        cursorText.html(cursorTextValue);
      },1500);
    });
  }
});

$('body')
  .on('mouseenter mouseover','.flickity-prev-next-button', function() {
    $('.cursor').hide();
    if ($(this).hasClass('previous')) { 
      $('.arrow-previous').show();
    }
    if ($(this).hasClass('next')) { 
      $('.arrow-next').show();
    }
  })
  .on('mouseleave','.flickity-prev-next-button', function() {
    $('body').addClass('show-cursor');
    $('.cursor').show();
    $('.arrow').hide();
  })
  .on('mouseenter mouseover','.flickity-slider, .single-product-image', function() {
    var cursor_action = $('.product-page-title').data('cursor-action');
    if (cursor_action) { 
      $('.cursor').addClass('expanded').find('.cursor-text-caption').html(cursor_action);
    }
    
  })
  .on('mouseleave','.flickity-slider, .single-product-image', function() {
    $('.cursor').removeClass('expanded');
  })
  .on('click','.flickity-slider, .single-product-image', function() {
    if ($('.product-page-button').hasClass('add-to-cart-button')) { 
      $('.product-form').submit()[0];
    }
    else { 
      openOverlay('.product-option-overlay');
    }
  })
  .on( 'click','.dark-overlay', function() {
    hideCart();
  })
  .on( 'click','.qty-button', function() {
    var $t = $(this)
    , input = $(this).parent().find('input')
    , val = parseInt(input.val())
    , valMin = 1
    , item_id = $(this).parent().data("cart-id");
    if (isNaN(val) || val < valMin) {
      var new_val = valMin;
    }
    if ($t.data('func') == 'plus') {
      var new_val = val + 1;
    }
    else {
      if (val > valMin) {
        var new_val = val - 1;
      }
      if ($t.data('func') == 'remove') { 
        var new_val = 0;
      }
    }
    if (new_val > 0) { 
      Cart.updateItem(item_id, new_val, function(cart) {
        processCartUpdate(input, item_id, new_val, cart);
      });
    }
    else { 
      Cart.removeItem(item_id, function(cart) {
        processCartUpdate(input, item_id, 0, cart);
      });
    }
  })
  .on( 'blur','.qty-input', function(e) {
    e.preventDefault();
    var item_id = $(this).parent().data("cart-id");
    var new_val = $(this).val();
    var input = $(this);
    if (!isNaN(new_val)) { 
      Cart.updateItem(item_id, new_val, function(cart) {
        processCartUpdate(input, item_id, new_val, cart);
      });
    }
  })
  
  .on( 'mouseover','.grow-cursor', function(e) {
    if (!$(this).hasClass('small-expanded')) { 
      $('.cursor').addClass('small-expanded');
    }
  })
  .on( 'mouseleave','.grow-cursor', function(e) {
    $('.cursor').removeClass('small-expanded');
  })
  
  
  .on( 'mouseover','.product-card', function(e) {
    if (!$(this).hasClass('expanded')) { 
      $('.cursor').addClass('expanded');
    }
  })
  .on( 'mouseleave','.product-card', function(e) {
    $('.cursor').removeClass('expanded');
  })

$('.main').on( 'click','.infinite-scroll-last', function(e) {
  $('html, body').animate({ scrollTop: 0 }, 200);
})


var processCartUpdate = function(input, item_id, new_val, cart) {
  var item_count = cart.item_count;
  var sub_total = Format.money(cart.total, true, true);
  var singular = $('.cart-page-title').data('singular'); 
  var plural = $('.cart-page-title').data('plural');
  var cart_title = Format.pluralize(item_count, singular, plural);
  $('.cart-items-title').html(cart_title);
  if (item_count == 0) {
    if ($('body').attr('id') == "cart") {
      $('.cart-form').slideUp('fast', function() { 
        $('.cart-empty-message').slideDown('fast');
      })
      
    }
    else { 
      hideCart();
      var $cartLink = $(".cart-link");
      $cartLink.html(cart.item_count);
      $cartLink.addClass('hidden');
    }
  }
  else {
    input.val(new_val);
    $('.cart-errors').remove();
    $('.checkout-btn-total').html(sub_total);
    $('.cart-link').html(item_count);
    $('.checkout-btn').attr("name","checkout");
    if (new_val == 0) { 
      $('.cart-item[data-cart-id="'+item_id+'"]').slideUp('fast');
    }
  }
  return false;
}
