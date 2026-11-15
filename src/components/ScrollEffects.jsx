import { useEffect } from 'react';

export default function ScrollEffects() {
  useEffect(() => {
    // Scroll progress hairline
    const bar = document.createElement('div');
    bar.className = 'progress';
    document.body.appendChild(bar);

    const prog = () => {
      const h = document.documentElement;
      const m = h.scrollHeight - h.clientHeight;
      bar.style.transform = `scaleX(${m > 0 ? Math.min(1, window.scrollY / m) : 0})`;
    };
    window.addEventListener('scroll', prog, { passive: true });
    prog();

    const tween = (ms, fn) => {
      let t0 = null;
      const f = (t) => {
        if (t0 === null) t0 = t;
        const p = Math.min(1, (t - t0) / ms);
        fn(1 - Math.pow(1 - p, 3));
        if (p < 1) requestAnimationFrame(f);
      };
      requestAnimationFrame(f);
    };

    const ringUp = (arc, num, fullLen, gap) => {
      if (!arc || !num) return;
      const targetAttr = num.getAttribute('data-target');
      const targetVal = targetAttr !== null && targetAttr !== '' ? Number(targetAttr) : null;
      if (targetVal === null || isNaN(targetVal) || targetVal <= 0) {
        arc.setAttribute('stroke-dasharray', `0 ${gap}`);
        return;
      }
      const actualLen = fullLen * (Math.min(targetVal, 100) / 100);
      tween(1800, (e) => {
        arc.setAttribute('stroke-dasharray', `${(actualLen * e).toFixed(1)} ${gap}`);
        num.textContent = Math.round(targetVal * e);
      });
    };

    // Hero arc starts after 500ms
    const heroTimer = setTimeout(() => {
      ringUp(document.getElementById('heroArc'), document.getElementById('heroNum'), 339.3, 339.3);
    }, 500);

    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          el.classList.add('in');
          io.unobserve(el);
          setTimeout(() => {
            el.style.removeProperty('--d');
          }, 1400);
        });
      }, { threshold: 0.12 });

      const selectors = '.head,.say,.say-grid .lede,.step,.plan,.stations,.detail,.bigring,.score>div:last-child,.liv>div:first-child,.phone,.flow,.os>div:last-child,.why article,.tier,.model,.partner,.faq details,.about>div,.stat';
      document.querySelectorAll(selectors).forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) return;
        const siblings = el.parentNode ? Array.from(el.parentNode.children) : [];
        const i = siblings.indexOf(el);
        el.style.setProperty('--d', `${Math.min(i >= 0 ? i : 0, 5) * 70}ms`);
        el.classList.add('rv');
        io.observe(el);
      });

      const once = (el, fn, th) => {
        if (!el) return;
        const o = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            o.disconnect();
            fn();
          }
        }, { threshold: th || 0.5 });
        o.observe(el);
      };

      once(document.querySelector('.bigring'), () => {
        ringUp(document.getElementById('bigArc'), document.getElementById('bigNum'), 578.1, 578.1);
      });

      const s100 = document.getElementById('stat100');
      if (s100) {
        once(s100, () => {
          tween(1400, (e) => {
            s100.textContent = `${Math.round(100 * e)}+`;
          });
        });
      }

      const lt = document.getElementById('livText');
      if (lt) {
        const full = lt.textContent;
        once(lt, () => {
          if (lt.parentNode) {
            lt.parentNode.style.minHeight = `${lt.parentNode.offsetHeight}px`;
          }
          lt.textContent = '';
          let n = 0;
          setTimeout(() => {
            const iv = setInterval(() => {
              n++;
              lt.textContent = full.slice(0, n);
              if (n >= full.length) clearInterval(iv);
            }, 28);
          }, 400);
        });
      }
    }

    return () => {
      clearTimeout(heroTimer);
      window.removeEventListener('scroll', prog);
      if (bar.parentNode) bar.parentNode.removeChild(bar);
      if (io) io.disconnect();
    };
  }, []);

  return null;
}
