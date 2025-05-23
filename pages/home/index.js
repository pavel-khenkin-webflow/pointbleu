import { gsap, ScrollTrigger, SplitText } from 'gsap/all';

function init() {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  let mm = gsap.matchMedia();
  const isMobile = window.innerWidth < 479;

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
  
  // Design THAT LEVATES...=============
  mm.add(
    {
      isMobile: "(max-width: 479px)",
      isDesktop: "(min-width: 480px)",
    },
    (context) => {
      let selector;
      let startValue;
      let endValue;
  
      if (context.conditions.isMobile) {
        selector = "[data-mind-text-mobile]";
        startValue = "top 25%";
        endValue = "bottom 50%";
      } else {
        selector = "[data-mind-text-pc]";
        startValue = "top center";
        endValue = "bottom center";
      }
  
      const textElement = document.querySelector(selector);
      if (!textElement) {
        console.warn(`❌ Элемент ${selector} не найден`);
        return;
      }
  
      const targets = textElement.querySelectorAll(
        context.conditions.isMobile ? ".word" : ".line"
      );
  
      const allChars = [];
  
      targets.forEach((el) => {
        const split = new SplitText(el, {
          type: "chars",
          charsClass: "char",
          tag: "span",
        });
  
        split.chars.forEach((char) => {
          Object.assign(char.style, {
            display: "inline",
          });
  
          if (char.textContent === ".") {
            char.style.marginLeft = "-0.125em";
          }
  
          allChars.push(char);
        });
      });
  
      // Анимация только цвета
      gsap.to(allChars, {
        color: "#3B52FB",
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".section_mind",
          start: startValue,
          end: endValue,
          toggleActions: "play none none reverse",
          scrub: 1,
        },
      });
    }
  );
  
  
  
  


}

document.addEventListener('DOMContentLoaded', init);


//сделать анимацию меню и split text
