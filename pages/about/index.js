import { gsap, ScrollTrigger, SplitText } from 'gsap/all';

function init() {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  let mm = gsap.matchMedia();
  const navComponent = document.querySelector('.header');
  const logoSmall = document.querySelector('.header_logo-small');
  const logoLarge = document.querySelector('.header_logo-large');
  const mindTitle = document.querySelector('.main_content');
  let lastScrollTop = 0;
  let lastDirection = null; // Последнее направление: 'down' или 'up'

  // Инициализация начального положения хедера
  gsap.set(navComponent, { y: '0%' });

  // Функция для анимации хедера при скролле
  function handleScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    const direction = currentScroll > lastScrollTop ? 'down' : 'up';

    // Обновляем lastScrollTop на каждой итерации
    lastScrollTop = currentScroll;

    // Если направление не изменилось, ничего не делаем
    if (direction === lastDirection) return;

    // Обновляем направление
    lastDirection = direction;

    const tl = gsap.timeline();

    if (direction === 'down') {
      // Скролл вниз - скрыть хедер и переключить лого
      tl.to(logoLarge, { width: '2.125em', duration: 0.35, ease: "linear" })
        .to(logoLarge, { opacity: 0, duration: 0.2 })
        .to(logoSmall, { opacity: 1, duration: 0.2 }, '-=0.2')
        .to(navComponent, { y: '-100%', duration: 0.2, ease: "linear" });
    } else if (direction === 'up') {
      // Скролл вверх - показать хедер и переключить лого
      tl.to(navComponent, { y: 0, duration: 0.2, ease: "linear" })
        /*.to(logoSmall, { opacity: 0, duration: 0.2 })
        .to(logoLarge, { opacity: 1, duration: 0.2 }, '-=0.2')
        .to(logoLarge, { width: 'auto', duration: 0.35, ease: "linear" });*/
    }
  }

  // Инициализация ScrollTrigger для изменения фона хедера
  ScrollTrigger.create({
    trigger: '.section_hero',
    start: 'bottom top',
    onEnter: () => gsap.to(navComponent, { backgroundColor: '#fff', duration: 0.4, ease: 'power1.out' }),
    onEnterBack: () => gsap.to(navComponent, { backgroundColor: 'transparent', duration: 0.4, ease: 'power1.out' }),
  });

  // Функция для анимации слайдера "mind"
  function updateMindTitlePosition() {
    if (mindTitle) {
      const mindTitleWidth = mindTitle.scrollWidth;
      const offset = mindTitleWidth - window.innerWidth;
      const mindTl = gsap.timeline({ scrollTrigger: { trigger: '.section_mind', start: '30% top', end: 'bottom bottom', scrub: 2 } });

      if (offset > 0) {
        mindTl.clear(); // Очистить предыдущую анимацию
        mindTl.to(mindTitle, { x: `-${offset}px` });
      } else {
        mindTl.clear();
        mindTl.to(mindTitle, { x: 0 });
      }
    }
  }

  // Дебаунс функция
  function debounce(func, delay) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }

  // Инициализация событий
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', debounce(updateMindTitlePosition, 200));

  // Вызов функции для первой инициализации
  updateMindTitlePosition();
  
  // about
  const phTitle = new SplitText('[da="about-title"]', { type: 'words, chars' });
  const phTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.philosophy_trigger',
      start: 'top+=5% top',
      end: 'bottom bottom',
      scrub: 1,
    },
  });
  phTl.to(phTitle.chars, {
    color: 'var(--text-colors--primary-dark)',
    stagger: 0.3,
    ease: 'none',
  });

  // Cards
  const phCards = document.querySelectorAll('.philosophy_card');
  mm.add(
    {
      isDesktop: '(min-width: 767px)',
    },
    context => {
      phCards[2].classList.add('is--active');
      phCards.forEach(card => {
        const cardTitle = card.querySelector('.philosophy_card .h3');
        card.addEventListener('mouseenter', function () {
          // Удаляем класс is--active у всех карточек
          phCards.forEach(c => c.classList.remove('is--active'));
          card.classList.add('is--active');
          ScrollTrigger.refresh();
        });
      });
      // Support
      const supTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.section_charity',
          start: 'top center',
          end: 'bottom center',
          scrub: 2,
        },
      });
      supTl.to('.charity_container', {
        clipPath: 'polygon(-50% 0, 150% 0, 150% 100%, -50% 100%)',
        transform: 'translateZ(0)',
        duration: 1,
        ease: 'power1.out',
      });
      supTl.to(
        '.charity_content',
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power1.out',
        },
        '<'
      );
    }
  );
  mm.add(
    {
      isDesktop: '(max-width: 766px)',
    },
    context => {
      function mobCardInit() {
        phCards[0].classList.add('is--active');
        console.log('Class added, waiting for resize...');
      }

      // Создаём ResizeObserver
      const observer = new ResizeObserver(() => {
        ScrollTrigger.refresh(); // Обновляем триггеры
        console.log('Height changed, ScrollTrigger refreshed!');
      });
      const section = document.querySelector('.section_philosophy');
      observer.observe(section);
      setTimeout(() => {
        mobCardInit();
        setTimeout(() => {
          observer.disconnect();
          console.log('Observer disconnected.');
        }, 2000);
      }, 1000);

      phCards.forEach(card => {
        card.addEventListener('click', function () {
          // Удаляем класс is--active у всех карточек
          phCards.forEach(c => c.classList.remove('is--active'));
          card.classList.add('is--active');
          ScrollTrigger.refresh();
        });
      });
      // Support
      const supTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.section_charity',
          start: 'top center',
          end: 'bottom center',
          scrub: 2,
        },
      });
      supTl.to(
        '.charity_content',
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power1.out',
        },
        '<'
      );
    }
  );
  // Team section
  const teamTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.team_trigger',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
    },
  });
  teamTl.to('.team_line', {
    x: '20%',
    duration: 1,
    ease: 'none',
  });
  teamTl.to(
    '.team_line-reverse',
    {
      x: '-20%',
      duration: 1,
      ease: 'none',
    },
    0
  );
}

document.addEventListener('DOMContentLoaded', init);
