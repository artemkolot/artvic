// // require('./other_script.js') // Require Other Script(s) from app/js folder Example

var slider = function (sliderElement) {
	
	var pages = [];
	var currentSlide = 1;
	var isChanging = false;
	var keyUp = {38:1, 33:1};
	var keyDown = {40:1, 34:1};
	
	var init = function () {
		document.body.classList.add('slider__body');
		
		// control scrolling
		let whatWheel = 'onwheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
		window.addEventListener(whatWheel, function (e) {
			var direction = e.wheelDelta || e.deltaY;
			if (direction > 0) {
				changeSlide(-1);
			} else {
				changeSlide(1);
			}
		});
		
		// allow keyboard input
		window.addEventListener('keydown', function (e) {
			if (keyUp[e.keyCode]) {
				changeSlide(-1);
			} else if (keyDown[e.keyCode]) {
				changeSlide(1);
			}
		});
		
		// page change animation is done
		detectChangeEnd() && document.querySelector(sliderElement).addEventListener(detectChangeEnd(), function () {
			if (isChanging) {
				setTimeout(function() {
					isChanging = false;
					window.location.hash = document.querySelector('[data-slider-index="' + currentSlide + '"]').id;
				}, 100); // 400 default
			}
		});
		
		// set up page and build visual indicators
		document.querySelector(sliderElement).classList.add('slider__container');
		var indicatorContainer = document.createElement('ul');
		indicatorContainer.classList.add('slider__indicators');
		
		var index = 1;
		[].forEach.call(document.getElementsByTagName('section'), function (section) {
			
			var indicator = document.createElement('a');
			let hint = document.createElement('span');
			hint.innerHTML = section.getAttribute('data-alt');
			hint.classList.add('slider__indicator_hint');
			
			indicator.classList.add('slider__indicator')
			indicator.setAttribute('data-slider-target-index', index);
			
			// Slide to section by indicator click
			indicator.addEventListener("click", (e) => {
				e.preventDefault();
				gotoSlide('section[data-slider-index = "' + e.target.dataset.sliderTargetIndex +'"]');
			});
			
			// Create indicator li > a, span
			let indicatorItem = document.createElement('li');
			indicatorItem.appendChild(indicator);
			indicatorItem.appendChild(hint);
			
			//Ad li to ul
			indicatorContainer.appendChild(indicatorItem);
			
			section.classList.add('slider__page');
			pages.push(section);
			section.setAttribute('data-slider-index', index++);
		});
		
		document.body.appendChild(indicatorContainer);
		document.querySelector('a[data-slider-target-index = "' + currentSlide +'"]').classList.add('slider__indicator--active');
		
		
		// stuff for touch devices
		var touchStartPos = 0;
		var touchStopPos = 0;
		var touchMinLength = 90;
		document.addEventListener('touchstart', function (e) {
			e.preventDefault();
			if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
				var touch = e.touches[0] || e.changedTouches[0];
				touchStartPos = touch.pageY;
			}
		});
		document.addEventListener('touchend', function (e) {
			e.preventDefault();
			if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
				var touch = e.touches[0] || e.changedTouches[0];
				touchStopPos = touch.pageY;
			}
			if (touchStartPos + touchMinLength < touchStopPos) {
				changeSlide(-1);
			} else if (touchStartPos > touchStopPos + touchMinLength) {
				changeSlide(1);
			}
		});
	};
	
	
	// prevent double scrolling
	var detectChangeEnd = function () {
		var transition;
		var e = document.createElement('foobar');
		var transitions = {
			'transition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'MozTransition': 'transitionend',
			'WebkitTransition': 'webkitTransitionEnd'
		};
		
		for(transition in transitions) {
			if (e.style[transition] !== undefined) {
				return transitions[transition];
			}
		}
		return true;
	};
	
	
	// handle css change
	var changeCss = function (obj, styles) {
		for (var _style in styles) {
			if (obj.style[_style] !== undefined) {
				obj.style[_style] = styles[_style];
			}
		}
	};
	
	// handle page/section change
	var changeSlide = function (direction) {
		
		// already doing it or last/first page, staph plz
		if (isChanging || (direction == 1 && currentSlide == pages.length) || (direction == -1 && currentSlide == 1)) {
			return;
		}
		
		// change page
		currentSlide += direction;
		isChanging = true;
		changeCss(document.querySelector(sliderElement), {
			transform: 'translate3d(0, ' + -(currentSlide - 1) * 100 + '%, 0)'
		});
		
		// change dots
		document.querySelector('a.slider__indicator--active').classList.remove('slider__indicator--active');
		document.querySelector('a[data-slider-target-index="' + currentSlide +'"]').classList.add('slider__indicator--active');
	};
	
	// go to spesific slide if it exists
	var gotoSlide = function (where) {
		var target = document.querySelector(where).getAttribute('data-slider-index');
		if (target != currentSlide && document.querySelector(where)) {
			changeSlide(target - currentSlide);
		}
	};
	
	// if page is loaded with hash, go to slide
	if (location.hash) {
		setTimeout(function () {
			window.scrollTo(0, 0);
			gotoSlide(location.hash);
		}, 1);
	};
	
	// we have lift off
	if (document.readyState === 'complete') {
		init();
	} else {
		window.addEventListener('onload', init(), false);
	}
	
	// expose gotoSlide function
	return {
		gotoSlide: gotoSlide
	}
};

let setActivetedInputs = () => {
	let contactInputs = document.querySelectorAll('form.contact_form .form-control input');
	[].forEach.call(contactInputs, input => {
		input.addEventListener('input', (e)=> {
			if(input.value !== ""){
				input.classList.add('activated');
			} else {
				input.classList.remove('activated');
			}
		});
	})
}

let burgerToggle = ()=> {
	let burger = document.getElementById('burger');
	let header = document.getElementById('header');
	let mobileMenu = document.getElementById('mobile-menu');
	let contactLink = document.getElementById('contact-us-link');
	
	burger.addEventListener('click', ()=> {
		burger.classList.toggle("open");
		header.classList.toggle("fixed-header");
		mobileMenu.classList.toggle("active");
		contactLink.classList.toggle("active");
	})
}


// BURGER MENU LOGIC =========================================
const burgers = document.getElementsByClassName("burger");
const mobileMenu = document.getElementById('mobile-menu');

// Функция для перебора одного масива но с разными колбеками
const burgersLoop = (callback) => {
	[].forEach.call(burgers, callback);
}

// Тригер класса open на бургере
const toogleBurgers = (item) => {
	item.classList.toggle("open");
}

// Клик по любому из бургеров, также должен менять остальные бургеры
const addBurgerClickEvents = function(item) {
	item.addEventListener('click', ()=> {
		burgersLoop(toogleBurgers);
		header.classList.toggle("fixed-header");
		mobileMenu.classList.toggle("active");
	});
}

// Вешаем на каждый бургер на страничке ивент на клик
let addBurgersEvents = () => {
	burgersLoop(addBurgerClickEvents)
}

// BURGER MENU LOGIC END=========================================

// COLAPSE LOGIC ===================================================
	const itemsLoop = (items, callback) => {
		[].forEach.call(items, callback);
	}

	const toggleClass = (el) => {
		el.classList.toggle('active');
	}

	const collapses = document.getElementsByClassName('acordion');

	function addCollapses() {
		[].forEach.call(collapses, collapse => {
			const items = collapse.getElementsByTagName('li');
			[].forEach.call(items, li => {
				li.addEventListener('click', ()=> {
					if (li.classList.contains('active')){
						toggleClass(li);
						return;
					}
					let activeEl = [].find.call(items, el => el.classList.contains('active'));
					if (activeEl) {
						toggleClass(activeEl);
					}
					toggleClass(li);
				})
			})
		})
	}
// COLAPSE LOGIC END ===================================================


// SMOOTH
let approachCards = document.getElementsByClassName('approach-card');

function initViewPort(){
	window.addEventListener('scroll', onScroll);
}

function onScroll(event){
	let scrollPos = window.scrollY;
	let approachLinks = document.querySelectorAll('.approach-menu ul.menu-list a');
	[].forEach.call(approachLinks, link => {
		let id = link.getAttribute('href').replace('#', '');
		let refElement = document.getElementById(id);
		if (refElement.offsetTop <= scrollPos && refElement.offsetTop + refElement.clientHeight > scrollPos) {
            itemsLoop(approachLinks, link => {link.parentNode.classList = ""});
            link.parentNode.classList.toggle("active");
        }
	})
}

const links = document.querySelectorAll(".approach-menu ul.menu-list li a");

for (const link of links) {
  link.addEventListener("click", clickHandler);
}

function clickHandler(e) {
  e.preventDefault();
  const href = this.getAttribute("href");
  const offsetTop = document.querySelector(href).offsetTop;

  scroll({
    top: offsetTop,
    behavior: "smooth"
  });
}
// SMOOTH END

document.addEventListener('DOMContentLoaded', () => {
	// slider('.slides');
	setActivetedInputs();
	addBurgersEvents();
	addCollapses();
	initViewPort();
});