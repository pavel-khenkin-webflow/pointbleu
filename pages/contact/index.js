import { gsap, ScrollTrigger, SplitText } from 'gsap/all';

function init() {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const navComponent = document.querySelector('.header');
  const logoSmall = document.querySelector('.header_logo-small');
  const logoLarge = document.querySelector('.header_logo-large');

  let lastScrollTop = 0;
  let lastDirection = null;
  let isAnimating = false;
  let isHeaderHidden = false;
  let hasScrolled = false; // Флаг для первого скролла
  let delayTimeout = null;
  let ticking = false;

  const threshold = 3 * parseFloat(getComputedStyle(document.documentElement).fontSize);

  function handleScroll() {
    if (!hasScrolled) return;

    // Если бургер-меню открыто — не скрываем хедер
    if (document.body.classList.contains('is--locked')) {
      gsap.to(navComponent, { y: 0, duration: 0.2, ease: "linear" });
      isHeaderHidden = false;
      return;
    }

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

  // Сброс положения хедера при загрузке страницы
  window.addEventListener('load', () => {
    if (window.pageYOffset > threshold) {
      gsap.set(navComponent, { y: 0 });
      isHeaderHidden = false;
      hasScrolled = false;
    }
  });

  // Скролл для запуска handleScroll после первого движения
  window.addEventListener('scroll', () => {
    if (!hasScrolled) {
      hasScrolled = true;
      return;
    }
    handleScroll();
  });

  // Анимация изменения фона хедера при скролле
  ScrollTrigger.create({
    trigger: '.section_hero',
    start: 'bottom top',
    onEnter: () => {
      gsap.to(navComponent, { backgroundColor: '#fff', duration: 0.4, ease: 'power1.out' });
    },
    onEnterBack: () => {
      gsap.to(navComponent, { backgroundColor: 'transparent', duration: 0.4, ease: 'power1.out' });
    },
    markers: false // Убери, если нужны маркеры для отладки
  });

  // Анимация SplitText для текста
  const splitTextElement = document.querySelector('[data-split="text"]');
  if (splitTextElement) {
    const splitTextInstance = new SplitText(splitTextElement, { type: 'words, chars' });

    gsap.to(splitTextInstance.chars, {
      color: "#3B52FB",
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".contact_col-1",
        start: "top center",
        end: "bottom center",
        scrub: 1,
      },
    });
  }
}

document.addEventListener('DOMContentLoaded', init);

