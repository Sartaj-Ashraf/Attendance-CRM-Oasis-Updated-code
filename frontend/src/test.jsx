import { useEffect, useRef } from "react";

const Ballpit = ({
  count = 120,
  gravity = 0.6,
  friction = 0.9,
  colors = ["#6366F1", "#8B5CF6", "#A78BFA"], // blue shades
  cursorColor = "#FFFFFF", // white cursor balls
}) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const balls = [];

    // 🔵 create balls
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      balls.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        r: Math.random() * 3 + 2,
        color,
        baseColor: color,
      });
    }

    // 🖱️ mouse tracking
    const onMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const onMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    const DISTANCE = 90;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      balls.forEach((ball) => {
        // physics
        ball.vy += gravity * 0.02;
        ball.vx *= friction;
        ball.vy *= friction;

        ball.x += ball.vx;
        ball.y += ball.vy;

        // bounce
        if (ball.x < 0 || ball.x > canvas.width) ball.vx *= -1;
        if (ball.y < 0 || ball.y > canvas.height) ball.vy *= -1;

        // distance from cursor
        const dx = ball.x - mouseRef.current.x;
        const dy = ball.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const isNearCursor = dist < DISTANCE;

        // 🎨 color logic
        ball.color = isNearCursor ? cursorColor : ball.baseColor;

        // ✨ glow for cursor balls
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;

        if (isNearCursor) {
          ctx.shadowBlur = 14;
          ctx.shadowColor = cursorColor;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.closePath();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [count, gravity, friction, colors, cursorColor]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default Ballpit;
