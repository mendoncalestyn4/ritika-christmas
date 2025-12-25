import React, { useEffect, useRef } from 'react';

const Snowfall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventE;
    window.addEventListener('resize', resize);
    resize();

    const flakes: Snowflake[] = [];
    const flakeCount = 80;

    class Snowflake {
      x: number;
      y: number;
      radius: number;
      speed: number;
      opacity: number;
      drift: number;
      hue: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.radius = Math.random() * 3 + 1.5;
        this.speed = Math.random() * 1.2 + 0.4;
        this.opacity = Math.random() * 0.6 + 0.3;
        this.drift = Math.random() * 0.6 - 0.3;
        // assign a random pastel hue and build an HSLA color string
        this.hue = Math.floor(Math.random() * 360);
        this.color = `hsla(${this.hue}, 65%, 92%, ${this.opacity})`;
      }

      update() {
        this.y += this.speed;
        this.x += this.drift;

        if (this.y > height) {
          this.y = -10;
          this.x = Math.random() * width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        // soft shadow so pastel flakes remain visible on light backgrounds
        ctx.shadowColor = 'rgba(0,0,0,0.08)';
        ctx.shadowBlur = Math.max(1, this.radius * 1.8);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < flakeCount; i++) {
      flakes.push(new Snowflake());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      flakes.forEach((flake) => {
        flake.update();
        flake.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
};

export default Snowfall;
