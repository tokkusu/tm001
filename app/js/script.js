function testWebP(callback) {
   const webP = new Image();
   webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
   };
   webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
   
testWebP(function (support) {
   if (support == true) {
      document.querySelector('body').classList.add('webp');
   } 
   // else {
   //    document.querySelector('body').classList.add('no-webp');
   //   }   
});
   
$(function() {
   $('.products__slider').slick({
      infinite: false,
      autoplay: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: '<button class="slider-btn slider-btn__left"><svg class="slider-btn__icon"><use xlink:href="images/svgicons.svg#arrow-left"></use></svg></button>',
      nextArrow: '<button class="slider-btn slider-btn__right"><svg class="slider-btn__icon"><use xlink:href="images/svgicons.svg#arrow-right"></use></svg></button>'
   });   
});

$(function() {
   $('.questions__item-title').on('click', function() {
   $('.questions__item').removeClass('questions__item--active');
   $(this).parent().addClass('questions__item--active');
   });
});

$(function() {
   $.scrollify({
     sectionName : false,
     section : ".page-section",
     interstitialSection : ".header",
     touchScroll: false
   });
});


const button  = document.querySelector('.menu__btn');
const menu    = document.querySelector('.menu__list');
const logo    = document.querySelector('.logo__img');
const links   = document.querySelectorAll('.menu__list-link');

button.addEventListener('click', function () {
   button.classList.toggle('menu__btn--active');
   menu.classList.toggle('menu__list--active');
});

logo.addEventListener('click', function () {   
   button.classList.remove('menu__btn--active');
   menu.classList.remove('menu__list--active');
   });

links.forEach(function (link) {
   link.addEventListener('click', function () {
   button.classList.remove('menu__btn--active');
   menu.classList.remove('menu__list--active');
   });
});