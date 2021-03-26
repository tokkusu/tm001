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
     sectionName: false,
     section: ".page-section",
     interstitialSection: ".header",
     touchScroll: false,
   });
});

// if (document.body.classList.contains('lock')) {
//    $.scrollify.disable();
// } else {
//    $.scrollify.enable();
// };

// Меню бургер
const button  = document.querySelector('.menu__btn');
const menu    = document.querySelector('.menu__list');
const logo    = document.querySelector('.logo__img');
const links   = document.querySelectorAll('.menu__list-link');

button.addEventListener('click', function () {
   button.classList.toggle('menu__btn--active');
   menu.classList.toggle('menu__list--active');
   document.body.classList.toggle('lock');
   if (document.body.classList.contains('lock')) {
      $.scrollify.disable();
   } else {
      $.scrollify.enable(); 
   };
});

logo.addEventListener('click', function () {   
   button.classList.remove('menu__btn--active');
   menu.classList.remove('menu__list--active');
   document.body.classList.remove('lock');
   });

links.forEach(function (link) {
   link.addEventListener('click', function () {
   button.classList.remove('menu__btn--active');
   menu.classList.remove('menu__list--active');
   document.body.classList.remove('lock');
   });
});

// Модальное окно
const headerButton     = document.querySelectorAll('[data-modal-button]'),
      modalButtonClose = document.querySelectorAll('[data-modal-close]'),
      allModal         = document.querySelectorAll('[data-modal]');

// Кнопки - открыть модалку
headerButton.forEach(function (i) {
   i.addEventListener('click', function () {
      const modalId = this.dataset.modalButton;
      const modal   = document.querySelector('#' + modalId);      

      if (!document.body.classList.contains('lock')) {
         document.body.classList.add('lock');
         $.scrollify.disable();
      };

      modal.classList.add('open');
      
      //Находим внутри открываемой модалки блок modal и запрещаем ему передавать клики родителям
      modal.querySelector('.modal').addEventListener('click', function (e) {
         e.stopPropagation();         
      });
   });
});

// Кнопки - закрыть модалку
modalButtonClose.forEach(function (item) {
   item.addEventListener('click', function () {
      const modal = this.closest('[data-modal]');         

      if (!menu.classList.contains('menu__list--active')) {
         modal.classList.remove('open');
         document.body.classList.remove('lock');
         $.scrollify.enable();         
      } else {
         modal.classList.remove('open');
      };      
   });
});

// Закрытие модалки по фейду
allModal.forEach(function (item) {
   item.addEventListener('click', function () {      

      if (!menu.classList.contains('menu__list--active')) {
         this.classList.remove('open');
         document.body.classList.remove('lock');
         $.scrollify.enable();
      } else {
         this.classList.remove('open');
      };
   });
});

// Обратный отсчёт
const days         = document.querySelector('#days');
const hours        = document.querySelector('#hours');
const minutes      = document.querySelector('#minutes');
const seconds      = document.querySelector('#seconds');

const currentMonth = new Date().getMonth();
const nextMonth    = new Date(`${currentMonth + 3} 03 2021 00:00:00`);

function updateCounter() {
   const currentTime  = new Date();
   const diffTime     = nextMonth - currentTime;

   const daysLeft     = Math.floor(diffTime / 1000 / 60 / 60 / 24);
   const hoursLeft    = Math.floor(diffTime / 1000 / 60 / 60) % 24;
   const minutesLeft  = Math.floor(diffTime / 1000 / 60) % 60;
   const secondsLeft  = Math.floor(diffTime / 1000) % 60;

   days.innerText     = daysLeft < 10 ? '0' + daysLeft : daysLeft;
   hours.innerText    = hoursLeft < 10 ? '0' + hoursLeft : hoursLeft;
   minutes.innerText  = minutesLeft < 10 ? '0' + minutesLeft : minutesLeft;
   seconds.innerText  = secondsLeft < 10 ? '0' + secondsLeft : secondsLeft;
   setTimeout(updateCounter, 1000);
};

setTimeout(updateCounter, 1000);