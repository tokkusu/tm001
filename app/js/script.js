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

// Проверка на мобильный браузер
// const isMobile = {
//    Android: function () {
//        return navigator.userAgent.match(/Android/i);
//    },
//    BlackBerry: function () {
//        return navigator.userAgent.match(/BlackBerry/i);
//    },
//    iOS: function () {
//        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
//    },
//    Opera: function () {
//        return navigator.userAgent.match(/Opera Mini/i);
//    },
//    Windows: function () {
//        return navigator.userAgent.match(/IEMobile/i);
//    },
//    any: function () {
//        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
//    }
// };

// Динамическое добавление фиксируещего класса для последующей компенсации скролла
window.addEventListener('DOMContentLoaded', function () {
   if (document.body.clientWidth > 1100) {
      document.querySelector('.header__info').classList.remove('fixed-element');
      document.querySelector('.menu__list').classList.remove('fixed-element');

   } else {
      document.querySelector('.header__info').classList.add('fixed-element');
      document.querySelector('.menu__list').classList.add('fixed-element');
   };   
})

window.addEventListener('resize', function(){
   if (document.body.clientWidth > 1100) {
      document.querySelector('.header__info').classList.remove('fixed-element');
      document.querySelector('.menu__list').classList.remove('fixed-element');

   } else {
      document.querySelector('.header__info').classList.add('fixed-element');
      document.querySelector('.menu__list').classList.add('fixed-element');
   };
});

// Собираем все элементы в массив
const fixedElPadding = document.querySelectorAll('.fixed-element');  

// Вычисляем величину компенсационного отступа
addPadding = window.innerWidth - document.body.offsetWidth + 'px'; 

function removepadding() {
   if (fixedElPadding.length > 0) {
      fixedElPadding.forEach(function (i) {
         i.style.paddingRight = '0px';
      }); 
   };

   document.body.style.paddingRight = '0px';   
};

// Меню бургер
const button  = document.querySelector('.menu__btn');
const menu    = document.querySelector('.menu__list');
const logo    = document.querySelector('.logo__img');
const links   = document.querySelectorAll('.menu__list-link');

button.addEventListener('click', function () {

   button.classList.toggle('menu__btn--active');
   menu.classList.toggle('menu__list--active');
   document.body.classList.toggle('lock'); 

   if (!document.body.classList.contains('lock')) {
      
      // Компенсация скролла      
      removepadding(); 

   $.scrollify.enable();

   } else {
      fixedElPadding.forEach(function (i) {
         i.style.paddingRight = addPadding;
      });

      document.body.style.paddingRight = addPadding; 
      $.scrollify.disable();
   };         
});

logo.addEventListener('click', function () {   

   // Компенсация скролла   
   removepadding();

   button.classList.remove('menu__btn--active');
   menu.classList.remove('menu__list--active');
   document.body.classList.remove('lock');
});

links.forEach(function (link) {
   link.addEventListener('click', function () {
           
      button.classList.remove('menu__btn--active');
      menu.classList.remove('menu__list--active');
      document.body.classList.remove('lock');

      // Компенсация скролла         
      removepadding(); 
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

      if (document.body.clientWidth > 1100) {
         document.querySelector('.header__info').classList.remove('fixed-element');
         document.querySelector('.menu__list').classList.remove('fixed-element');
      };

      const fixedElPadding = document.querySelectorAll('.fixed-element');
      
      if (!document.body.classList.contains('lock')) {
      
         // Компенсация скролла
         if (fixedElPadding.length > 0) {
            fixedElPadding.forEach(function (i) {
               i.style.paddingRight = addPadding;;         
            });
         };
         
      document.body.style.paddingRight = addPadding;;  
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
         
         // Компенсация скролла
         removepadding();

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
         
         // Компенсация скролла
         removepadding(); 

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

   const daysName    = document.querySelector('#daysName');
   const hoursName   = document.querySelector('#hoursName');
   const minutesName = document.querySelector('#minutesName');
   const secondsName = document.querySelector('#secondsName');
   
   // Склонение слов в дате
   function inflection(number, txt) {
      const cases = [2, 0, 1, 1, 1, 2];
      return txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
   };

   daysName.innerText    = inflection(days.innerText, ['День', 'Дня', 'Дней']);
   hoursName.innerText   = inflection(hours.innerText, ['Час', 'Часа', 'Часов']);
   minutesName.innerText = inflection(minutes.innerText, ['Минута', 'Минуты', 'Минут']);
   secondsName.innerText = inflection(seconds.innerText, ['Секунда', 'Секунды', 'Секунд']);

   setTimeout(updateCounter, 1000);
};

setTimeout(updateCounter, 1000);