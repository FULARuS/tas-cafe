import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { createRoot } from 'react-dom/client';
import Magnet from './vendor/react-bits/Magnet.jsx';

gsap.registerPlugin(ScrollTrigger);

const image = document.querySelector('[data-coffee-image]');
const scene = image.querySelector('[data-coffee-scene]');

function createCoffeeLoop() {
  const wisps = scene.querySelectorAll('.steam-wisp');
  const timeline = gsap.timeline({ paused: true, repeat: -1 });

  timeline.to(scene, {
    keyframes: { scale: [1, 1.028, 1], ease: 'sine.inOut', easeEach: 'sine.inOut' },
    duration: 6.8
  }, 0);

  for (const [index, wisp] of [...wisps].entries()) {
    const start = index * 1.7;
    const drift = index === 1 ? 20 : -16;
    timeline
      .fromTo(wisp, { opacity: 0, xPercent: 0, yPercent: 11, scale: 0.45, rotation: 0 }, {
        keyframes: {
          opacity: [0, 0.33, 0.26, 0.09, 0],
          xPercent: [0, drift * 0.1, drift * 0.3, drift * 0.65, drift],
          yPercent: [11, -11, -36, -58, -77],
          scale: [0.45, 0.67, 0.87, 1.11, 1.35],
          rotation: [0, drift * 0.2, -drift * 0.3, -drift * 0.5, -drift * 0.75],
          ease: 'sine.inOut',
          easeEach: 'none'
        },
        duration: 3.4,
        immediateRender: false
      }, start);
  }

  return timeline;
}

const responsiveMotion = gsap.matchMedia();
responsiveMotion.add('(prefers-reduced-motion: no-preference)', () => {
  const timeline = createCoffeeLoop();
  let inView = false;

  function updatePlayback() {
    timeline.paused(!inView || document.hidden);
  }

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.intersectionRatio >= 0.14;
    updatePlayback();
  }, { threshold: 0.14 });
  observer.observe(image);
  document.addEventListener('visibilitychange', updatePlayback);

  const lenis = new Lenis({ lerp: 0.112, stopInertiaOnNavigate: true });
  const tick = (time) => lenis.raf(time * 1000);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);

  for (const element of document.querySelectorAll('[data-reveal]')) {
    gsap.from(element, {
      y: 26,
      opacity: 0.6,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: { trigger: element, start: 'top 91%', once: true }
    });
  }

  return () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', updatePlayback);
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
});

const route = document.querySelector('[data-route-magnet]');
const link = route.querySelector('a');
createRoot(route).render(
  <Magnet padding={20} magnetStrength={7} maxOffset={6}>
    <a className={link.className} href={link.href} target={link.target} rel={link.rel}>{link.textContent}</a>
  </Magnet>
);
