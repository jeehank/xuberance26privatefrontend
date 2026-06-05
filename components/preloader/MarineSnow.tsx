"use client";

import { useEffect, useRef } from "react";

export default function MarineSnow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      opacity: number;
      amplitude: number;
      frequency: number;
    }> = [];

    const createParticle = (isInit = false) => {
      return {
        x: Math.random() * width,
        y: isInit ? Math.random() * height : height + 10,
        radius: 0.5 + Math.random() * 2,
        speedY: -(0.2 + Math.random() * 0.8),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: 0.1 + Math.random() * 0.5,
        amplitude: 0.5 + Math.random() * 1.5,
        frequency: 0.005 + Math.random() * 0.01,
      };
    };

    for (let i = 0; i < 150; i++) {
      particles.push(createParticle(true));
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * p.frequency) * 0.05 * p.amplitude;

        if (p.y < -10 || p.x < -10 || p.x > width + 10) {
          particles[i] = createParticle(false);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 254, ${p.opacity})`;
        ctx.shadowBlur = p.radius * 2;
        ctx.shadowColor = "#00f2fe";
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
