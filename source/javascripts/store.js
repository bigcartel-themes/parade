// overlay fade
// http://stackoverflow.com/questions/8788802/prevent-safari-loading-from-cache-when-back-button-is-clicked - rather than using $(window).pageshow(function(){
$(window).bind('pageshow', function(event) {
	//if ($('#overlay').length) {
	//	$('#overlay').delay(1000).fadeOut(600);
	//}
	if ($('.intro-overlay').length) {
		//$('body').css('background','#FFFFFF');
		var $this = $('.intro-overlay');
		$('.intro-overlay').delay(500).removeClass('preload').delay(500).queue(function(next) {
			$('.intro-overlay .intro-text').fadeIn(300, function() {
				$(this).stop();
				$this.stop().delay(500).fadeOut(600, function() { 
  				$('.product-card').fadeIn(300);
				});
			});																	  
		});
	}
});

document.addEventListener('DOMContentLoaded', function(){
	trigger = new ScrollTrigger({
	  toggle: {
	    visible: 'visible',
	    hidden: 'invisible'
	  },
	  centerVertical: true,
	  once: false
	}, document.querySelector(".product-list"), window);
	  var callback = function(scrollLeft, scrollTop, width, height){
  };
  trigger.attach(callback);
});

$('.product-list').infiniteScroll({
  path: '.next-button',
  append: '.product-card',
  hideNav: '.pagination',
  status: '.page-load-status',
  history: false,
  debug: false
});

$('.product-list').on( 'append.infiniteScroll', function( event, response, path, items ) {
  if (items) { 
    trigger.bind(items);
  }
});

var openOverlay = function(overlay_name) { 
  var scrollDiv = $('<div class="scrollbar-measure"></div>').appendTo(document.body)[0];
  var scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  $(overlay_name).addClass('show');
  $(overlay_name).find('.hamburger').addClass('is-active');
  if ($(window).height() < $(document).height()) {
    $(document.body).css('margin-right', scrollBarWidth + 'px');
  }
}

var closeOverlay = function(overlay_name) { 
  $(overlay_name).find('.hamburger').removeClass('is-active');
  $(overlay_name).removeClass('show');
  $(document.body).css('margin-right', '');
  $('.scrollbar-measure').remove();
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
  $('.flash-message').slideUp('fast');
})

$('.open-product-info').click(function(e) {
  e.preventDefault();
  openOverlay('.product-description-overlay');
});

$('.close-product-description-overlay').click(function(e) { 
  e.preventDefault();
  closeOverlay('.product-description-overlay');
});

window.addEventListener('touchstart', function onFirstTouch() {
  // Add a body class
  $('body').addClass('touch-device');
  
  // we only need to know once that a human touched the screen, so we can stop listening now
  window.removeEventListener('touchstart', onFirstTouch, false);
}, false);

function is_touch_device() {
 return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}

if (is_touch_device()) {
  $('body').addClass('touch-device');
}

var x = null;
var y = null;

document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

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

$(document).mousemove(function(e) {
  if ($('body').hasClass('show-cursor')) { 
    if ($('.cursor').hasClass('expanded')) { 
      $('.cursor').offset({
        left: getMouseX() - 50,
        top: getMouseY() - 50
      });
    }
    else { 
      $('.cursor').offset({
        left: getMouseX() - 6,
        top: getMouseY() - 6
      });
    }
  }
});

$('.infinite-scroll-last').click(function(e) { 
  e.preventDefault();
  $("html").animate({ scrollTop: 0 }, 200);
});


$("html").mouseleave(function(){
  $('body').removeClass('show-cursor');
});

$(".product-card")
  .bind('mouseover', function(event) {
    var product_price = $(this).data('tooltip');
    $('.cursor').addClass('expanded').find('.cursor-text-price').html(product_price);
  })
  .bind('mouseleave', function() {
    $('.cursor').removeClass('expanded');
  });
  
/*
$(".product-images")
  .bind('mouseenter', function(event) {
    $('.cursor').addClass('expanded').find('.cursor-text-price').html('Select Option');
  })
  .bind('mouseleave', function() {
    console.log('hmmm');
    //$('.cursor').show();
  });
*/

$(document).on('keyup',function(e) {
  if (e.keyCode == 27) {
    if (cartShowing) { 
      hideCart();
    }
    closeOverlay('.full-screen-overlay');
  }
});

$('.return-home-link').click(function(e) { 
  location.href = "/";
})

if ($("body").attr("id") != "cart") {
  cartShowing = false;
  $(document).on("click", ".cart-link", function(e) {
    e.preventDefault();
    if (!cartShowing) { showCart() }
    if (cartShowing) { hideCart() }
  }).on("click", ".close-cart", function(e) {
    e.preventDefault();
    if (cartShowing) { hideCart() }
  });
}


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

productImages = $('.multiple-product-images');
desktopProductImagesOptions = {
  accessibility: false,
  wrapAround: true,
  dragThreshold: 8,
  imagesLoaded: true,
  setGallerySize: true,
  adaptiveHeight: false
}
productImages.flickity(desktopProductImagesOptions);

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
  , addButton = $(this).find('.add-to-cart-button')
  , addText = $(this).find('.status-text')
  , addTextValue = addText.html()
  , addedText = addButton.data('added-text')
  , addingText = addButton.data('adding-text')
  , cartLink = $(".cart-link");
  if (quantity > 0 && itemID > 0) { 
    Cart.addItem(itemID, quantity, function(cart) { 
      closeOverlay('.product-option-overlay');
      cartLink.html(cart.item_count);
      cartLink.removeClass('hidden');
      cartLink.addClass('expanded');
      setTimeout(function(){
        cartLink.removeClass('expanded');
      },1500);
    });
  }
});

$('body')
  .on('mouseenter mouseover','.flickity-prev-next-button', function() {
    $('.cursor').hide();
    $('body').removeClass('show-cursor');
  })
  .on('mouseleave','.flickity-prev-next-button', function() {
    $('body').addClass('show-cursor');
    $('.cursor').show();
  })
  .on('mouseenter mouseover','.flickity-slider, .single-product-image', function() {
    if ($('.product-page-title').data('product-status') == 'active') {
      product_status = 'active'; 
      $('.cursor').addClass('expanded').find('.cursor-text-caption').html('Select option');
    }
    else { 
      $('.cursor').addClass('expanded').find('.cursor-text-caption').html($('.product-page-title').data('cursor-title'));
    }
  })
  .on('mouseleave','.flickity-slider, .single-product-image', function() {
    $('.cursor').removeClass('expanded');
  })
  .on('click','.flickity-slider, .single-product-image', function() {
    if (product_status == 'active') { 
      openOverlay('.product-option-overlay');
    }
  })
  .on( 'click','.close-cart-overlay', function() {
    hideCart();
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
  
var processCartUpdate = function(input, item_id, new_val, cart) {
  var item_count = cart.item_count;
  var sub_total = Format.money(cart.total, true, true);
  if (item_count == 0) {
    hideCart();
    var $cartLink = $(".cart-link");
    $cartLink.html(cart.item_count);
    $cartLink.addClass('hidden');
  }
  else {
    input.val(new_val);
    $('.cart-errors').remove();
    $('.checkout-btn-total').html(sub_total);
    $('.cart-link').html(item_count);
    $('.checkout-btn').attr("name","checkout");
  }
  if (new_val == 0) { 
    $('.cart-item[data-cart-id="'+item_id+'"]').slideUp('fast');
  }
  return false;
}
