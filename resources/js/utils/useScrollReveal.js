import { useEffect } from 'react';

/**
 * Hook ringan untuk reveal animasi saat elemen di-scroll ke dalam viewport.
 * Menambahkan class 'is-visible' pada elemen yang memiliki class '.reveal-on-scroll'.
 * 
 * @param {Array} dependencies - Dependency array opsional untuk re-observe saat data selesai di-load.
 */
export function useScrollReveal(dependencies = []) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // Fallback untuk browser lama / tanpa IntersectionObserver
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
      }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-visible)');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
      observer.disconnect();
    };
  }, dependencies);
}

export default useScrollReveal;
