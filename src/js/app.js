import { gsap } from 'gsap';
import { isWebp } from './modules/isWebp.js';
import Swiper, { Navigation, Autoplay } from 'swiper';

isWebp();

const body = document.body;
const burgerButton = body.querySelector('.header__burger');
const menu = body.querySelector('.header__navigation');
const animElements = body.querySelectorAll('.anim');
const form = body.querySelector('.form');
const emailInput = form.querySelector('[name="email"]');
const nameInput = form.querySelector('[name="username"]');
const messageInput = form.querySelector('[name="message"]');

let emailError = false;
let nameError = false;

burgerButton.addEventListener('click', () => {
  burgerButton.classList.toggle('header__burger--active');
  menu.classList.toggle('header__navigation--active');

  const hideScroll = menu.classList.contains('header__navigation--active')
    ? 'hidden'
    : 'auto';

    body.style.overflow = hideScroll;
});

menu.addEventListener('click', (e) => {
  const link = e.target.closest('.link');

  if (!link || !menu.contains(link)) {
    return;
  }

  burgerButton.classList.remove('header__burger--active');
  menu.classList.remove('header__navigation--active');
  body.style.overflow = 'auto';
});

const swiper = new Swiper('.slider', {
  modules: [Navigation, Autoplay],
  loop: true,

  navigation: {
    nextEl: '.slider__button--next',
    prevEl: '.slider__button--prev',
  },

  autoplay: {
    delay: 3000,
  },
});

const cardsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const { target } = entry;

      gsap.to(target, {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.6,
      });

      observer.unobserve(target);
    };
  });
}, {
  rootMargin: '100px',
});

animElements.forEach(animElement => cardsObserver.observe(animElement));

form.addEventListener('submit', e => {
  e.preventDefault();

  if (!emailError && !validateEmail(emailInput.value)) {
    emailError = true;
    emailInput.classList.add('form__input--error');
  };

  if (!nameError && !validateName(nameInput.value)) {
    nameError = true;
    nameInput.classList.add('form__input--error');
  };

  if (!emailError && !nameError) {
    emailInput.value = '';
    nameInput.value = '';
    messageInput.value = '';

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
});

emailInput.addEventListener('input', e => {
  if (emailError && validateEmail(e.target.value)) {
    emailError = false;

    e.target.classList.remove('form__input--error');
  };
});

nameInput.addEventListener('input', e => {
  if (nameError && validateName(e.target.value)) {
    nameError = false;

    e.target.classList.remove('form__input--error');
  };
});

const validateEmail = (email) => {
  const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return re.test(email);
};

const validateName = (name) => {
  const re = /^[a-zA-Z][\w -]{0,28}[a-zA-Z0-9]$/;
  return re.test(name);
};
