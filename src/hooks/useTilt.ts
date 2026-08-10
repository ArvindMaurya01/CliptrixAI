import { useRef, useEffect } from 'react';

export function useTilt(options = { max: 12, scale: 1.02, speed: 400 }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;

      const rX = ((yPct * -1) * options.max).toFixed(2);
      const rY = (xPct * options.max).toFixed(2);

      el.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(${options.scale}, ${options.scale}, ${options.scale})`;
    };

    const handleMouseLeave = () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      el.style.transition = `transform ${options.speed}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    };

    const handleMouseEnter = () => {
      el.style.transition = 'transform 50ms ease-out';
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [options]);

  return ref;
}
