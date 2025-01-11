import { gsap, ScrollTrigger, SplitText } from 'gsap/all'
function init() {
	gsap.registerPlugin(ScrollTrigger, SplitText)
	let mm = gsap.matchMedia()
	const navComponent = document.querySelector('.header')
	// Устанавливаем начальное положение хедера с помощью gsap.set
	gsap.set(navComponent, { y: '0%' })
	let lastScrollTop = 0
	window.addEventListener('scroll', () => {
		let currentScroll = window.pageYOffset || document.documentElement.scrollTop

		if (currentScroll > lastScrollTop) {
			// Скролл вниз - показать хедер
			gsap.to(navComponent, { y: '-100%', duration: 0.2, ease: 'linear' })
		} else {
			// Скролл вверх - скрыть хедер
			gsap.to(navComponent, { y: 0, duration: 0.2, ease: 'linear' })
		}
		lastScrollTop = currentScroll <= 0 ? 0 : currentScroll // Не позволяет получить отрицательное значение
	})

	// about
	const phTitle = new SplitText('[da="about-title"]', {
		type: 'words, chars',
	})
	const phTl = gsap.timeline({
		scrollTrigger: {
			trigger: '.philosophy_trigger',
			start: 'top+=5% top',
			end: 'bottom bottom',
			scrub: 1,
		},
	})
	phTl.to(phTitle.chars, {
		color: 'var(--text-colors--primary-dark)',
		stagger: 0.3,
		ease: 'none',
	})
	//  Cards
	const phCards = document.querySelectorAll('.philosophy_card')
	mm.add(
		{
			isDesktop: '(min-width: 767px)',
		},
		context => {
			phCards[2].classList.add('is--active')
			phCards.forEach(card => {
				const cardTitle = card.querySelector('.philosophy_card .h3')
				card.addEventListener('mouseenter', function () {
					// Удаляем класс is--active у всех карточек
					phCards.forEach(c => c.classList.remove('is--active'))
					card.classList.add('is--active')
					ScrollTrigger.refresh()
				})
			})
			// Support
			const supTl = gsap.timeline({
				scrollTrigger: {
					trigger: '.section_charity',
					start: 'top center',
					end: 'bottom center',
					scrub: 2,
				},
			})
			supTl.to('.charity_container', {
				clipPath: 'polygon(-50% 0, 150% 0, 150% 100%, -50% 100%)',
				transform: 'translateZ(0)',
				duration: 1,
				ease: 'power1.out',
			})
			supTl.to(
				'.charity_content',
				{
					opacity: 1,
					duration: 0.5,
					ease: 'power1.out',
				},
				'<'
			)
		}
	)
	mm.add(
		{
			isDesktop: '(max-width: 766px)',
		},
		context => {
			function mobCardInit() {
				phCards[0].classList.add('is--active')
				console.log('Class added, waiting for resize...')
			}

			// Создаём ResizeObserver
			const observer = new ResizeObserver(() => {
				ScrollTrigger.refresh() // Обновляем триггеры
				console.log('Height changed, ScrollTrigger refreshed!')
			})
			const section = document.querySelector('.section_philosophy')
			observer.observe(section)
			setTimeout(() => {
				mobCardInit()
				setTimeout(() => {
					observer.disconnect()
					console.log('Observer disconnected.')
				}, 2000)
			}, 1000)

			phCards.forEach(card => {
				card.addEventListener('click', function () {
					// Удаляем класс is--active у всех карточек
					phCards.forEach(c => c.classList.remove('is--active'))
					card.classList.add('is--active')
					ScrollTrigger.refresh()
				})
			})
			// Support
			const supTl = gsap.timeline({
				scrollTrigger: {
					trigger: '.section_charity',
					start: 'top center',
					end: 'bottom center',
					scrub: 2,
				},
			})
			supTl.to(
				'.charity_content',
				{
					opacity: 1,
					duration: 0.5,
					ease: 'power1.out',
				},
				'<'
			)
		}
	)
	// Team section
	const teamTl = gsap.timeline({
		scrollTrigger: {
			trigger: '.team_trigger',
			start: 'top top',
			end: 'bottom bottom',
			scrub: 1,
		},
	})
	teamTl.to('.team_line', {
		x: '20%',
		duration: 1,
		ease: 'none',
	})
	teamTl.to(
		'.team_line-reverse',
		{
			x: '-20%',
			duration: 1,
			ease: 'none',
		},
		0
	)
}

document.addEventListener('DOMContentLoaded', init)
