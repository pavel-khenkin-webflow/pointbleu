import { gsap, ScrollTrigger, SplitText } from 'gsap/all';

function init() {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  let mm = gsap.matchMedia();
  const mindTitle = document.querySelector('.main_content');

  // === Header Animation ===
  const navComponent = document.querySelector('.header');
  const logoSmall = document.querySelector('.header_logo-small');
  const logoLarge = document.querySelector('.header_logo-large');

  let lastScrollTop = 0;
  let lastDirection = null;
  let ticking = false;
  let delayTimeout = null;
  let isAnimating = false;
  let isHeaderHidden = false;
  let hasScrolled = false; // Флаг, был ли скролл после загрузки страницы

  const threshold = 3 * parseFloat(getComputedStyle(document.documentElement).fontSize);

  function handleScroll() {
    if (!hasScrolled) return; // Не запускаем анимацию, пока пользователь не начал скроллить

    if (!ticking) {
      requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const direction = currentScroll > lastScrollTop ? 'down' : 'up';

        lastScrollTop = currentScroll;

        if (currentScroll <= threshold) {
          if (!isHeaderHidden) {
            ticking = false;
            return;
          }

          gsap.to(navComponent, { y: 0, duration: 0.2, ease: "linear" });
          isHeaderHidden = false;
          lastDirection = null;
          ticking = false;
          return;
        }

        if (direction === lastDirection || delayTimeout || isAnimating) {
          ticking = false;
          return;
        }

        lastDirection = direction;
        isAnimating = true;

        const tl = gsap.timeline({
          onComplete: () => {
            isAnimating = false;
            if (window.pageYOffset <= threshold) {
              gsap.to(navComponent, { y: 0, duration: 0.2, ease: "linear" });
              isHeaderHidden = false;
              lastDirection = null;
            }
          }
        });

        if (direction === 'down') {
          tl.to(logoLarge, { width: '2.125em', duration: 0.35, ease: "linear" })
            .to(logoLarge, { opacity: 0, duration: 0.2 })
            .to(logoSmall, { opacity: 1, duration: 0.2 }, '+=0.1')
            .to(navComponent, { y: '-100%', duration: 0.2, ease: "linear", delay: 0.5 })
            .add(() => { isHeaderHidden = true; });
        } else {
          tl.to(navComponent, { y: 0, duration: 0.2, ease: "linear" })
            .add(() => { isHeaderHidden = false; });
        }

        delayTimeout = setTimeout(() => {
          delayTimeout = null;
        }, 1000);

        ticking = false;
      });

      ticking = true;
    }
  }

  // === Burger Menu Animation Pause ===
  function toggleAnimationsBasedOnLock() {
    const headerMenu = document.querySelector('.header_menu');
    if (!headerMenu) return; // Проверяем, существует ли элемент

    console.log('MutationObserver: Класс изменился на', headerMenu.classList.value);

    if (headerMenu.classList.contains('is--active')) {
      console.log('🛑 GSAP анимации ПАУЗА: is--active активен');
      gsap.globalTimeline.pause(); // Останавливаем все GSAP-анимации
      gsap.to(navComponent, { y: 0, duration: 0.2, ease: "linear" }); // Показываем хедер
      isHeaderHidden = false;
    } else {
      console.log('▶️ GSAP анимации ВОЗОБНОВЛЕНЫ: is--active удален');
      gsap.globalTimeline.resume(); // Возобновляем все GSAP-анимации
    }
  }

  // Проверяем, существует ли `.header_menu`, прежде чем создавать observer
  const headerMenu = document.querySelector('.header_menu');
  if (headerMenu) {
    const observer = new MutationObserver(() => toggleAnimationsBasedOnLock());
    observer.observe(headerMenu, { attributes: true, attributeFilter: ['class'] });
  } else {
    console.warn('⚠️ Warning: .header_menu не найден. Observer не запущен.');
  }

  // === ScrollTrigger для изменения фона хедера ===
  ScrollTrigger.create({
    trigger: '.section_hero',
    start: 'bottom top', // Фон хедера появляется в начале блока main_content
    onEnter: () => gsap.to(navComponent, { backgroundColor: '#fff', duration: 0.4, ease: 'power1.out' }),
    onEnterBack: () => gsap.to(navComponent, { backgroundColor: 'transparent', duration: 0.4, ease: 'power1.out' }),
  });

  // Проверяем положение скролла после загрузки страницы
  window.addEventListener('load', function () {
    if (window.pageYOffset > threshold) {
      gsap.set(navComponent, { y: 0 });
      isHeaderHidden = false;
      hasScrolled = false; // Сбрасываем флаг
    }
  });

  // Запускаем скрытие хедера **только после первого ручного скролла**
  window.addEventListener('scroll', function () {
    if (!hasScrolled) {
      hasScrolled = true; // Фиксируем первый скролл
      return;
    }
    handleScroll();
  });

  // === Other Animations ===

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
  window.addEventListener('resize', debounce(updateMindTitlePosition, 200));

  // Вызов функции для первой инициализации
  updateMindTitlePosition();
  
  // about
  const phTitle = new SplitText('[da="about-title"]', { type: 'words, chars' });
  const phTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.philosophy_top-left',
      start: 'top center',
      end: '80% center',
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
          end: 'center center',
          scrub: 2,
        },
      });
      /*supTl.to('.charity_container', {
        clipPath: 'polygon(-50% 0, 150% 0, 150% 100%, -50% 100%)',
        transform: 'translateZ(0)',
        duration: 1,
        ease: 'power1.out',
      });*/
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
      trigger: '.team_content',
      start: '30% bottom',
      end: 'bottom center',
      scrub: 1,
    },
  });
  teamTl.to('.team_line', {
    x: '110%',
    duration: 1,
    ease: 'none',
  });
  teamTl.to(
    '.team_line-reverse',
    {
      x: '-40%',
      duration: 1,
      ease: 'none',
    },
    0
  );
// Разделяем текст на слова
const teamLine = new SplitText('.team_line', { type: 'words' });

// Добавляем класс для изменения цвета при наведении
teamLine.words.forEach(word => {
  word.classList.add('hoverable-word');
});
// Разделяем текст на слова для .team_line-reverse
const teamLineReverse = new SplitText('.team_line-reverse', { type: 'words' });

// Добавляем класс для изменения цвета при наведении
teamLineReverse.words.forEach(word => {
  word.classList.add('hoverable-word');
});
  
}

document.addEventListener('DOMContentLoaded', init);
