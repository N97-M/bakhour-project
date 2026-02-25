'use client';
import { useEffect, useRef } from 'react';

export default function SmokeCanvas({ style }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let W = 0, H = 0;

        const updateDimensions = () => {
            const rect = canvas.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return false;

            const dpr = window.devicePixelRatio || 1;
            W = rect.width;
            H = rect.height;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            ctx.scale(dpr, dpr);
            return true;
        };

        // The jar lid top is at approximately 38% height in a centered layout
        const getOriginY = () => H * 0.38;
        const getOriginX = () => W * 0.5;

        class Tendril {
            constructor(offset = 0, delay = 0) {
                this.offset = offset;
                this.delay = delay;
                this.reset();
            }

            reset() {
                this.pts = [];
                this.age = -this.delay;
                this.life = 450 + Math.random() * 250;
                this.speed = 0.6 + Math.random() * 0.4;
                this.amplitude = 20 + Math.random() * 30; // Elegant curls
                this.freq = 0.01 + Math.random() * 0.008;
                this.lineWidth = 1.0 + Math.random() * 1.5; // Natural silk-like lines
                this.maxAlpha = 0.4 + Math.random() * 0.3; // Sophisticated transparency
                this.phase = Math.random() * Math.PI * 2;
            }

            update() {
                if (W === 0 || H === 0) return;

                this.age++;
                if (this.age < 0) return;

                const t = this.age;
                // Organic drifting
                const x = getOriginX() + this.offset
                    + Math.sin(t * this.freq + this.phase) * this.amplitude
                    + Math.sin(t * 0.04) * 6;
                const y = getOriginY() - (t * this.speed);

                this.pts.push({ x, y });
                if (this.pts.length > 150) this.pts.shift();

                if (this.age > this.life) this.reset();
            }

            draw() {
                if (this.age < 0 || this.pts.length < 5 || W === 0) return;

                const len = this.pts.length;
                let alpha = this.maxAlpha;
                if (this.age < 50) alpha *= (this.age / 50);
                else if (this.age > this.life - 120) alpha *= (this.life - this.age) / 120;

                ctx.save();
                ctx.globalCompositeOperation = 'screen';

                ctx.beginPath();
                ctx.moveTo(this.pts[0].x, this.pts[0].y);
                for (let i = 1; i < len - 2; i++) {
                    const xc = (this.pts[i].x + this.pts[i + 1].x) / 2;
                    const yc = (this.pts[i].y + this.pts[i + 1].y) / 2;
                    ctx.quadraticCurveTo(this.pts[i].x, this.pts[i].y, xc, yc);
                }

                // Soft subtle glow
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
                ctx.strokeStyle = `rgba(245, 240, 230, ${alpha})`;
                ctx.lineWidth = this.lineWidth;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();

                ctx.restore();
            }
        }

        const tendrils = Array.from({ length: 12 }, (_, i) =>
            new Tendril((Math.random() - 0.5) * 35, i * 45)
        );

        let animId;
        const animate = () => {
            animId = requestAnimationFrame(animate);
            if (W === 0 || H === 0) {
                if (!updateDimensions()) return;
            }

            ctx.clearRect(0, 0, W, H);
            tendrils.forEach(t => {
                t.update();
                t.draw();
            });
        };
        animate();

        const handleResize = () => { W = 0; };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1, // Moving back behind the jar
                ...style,
            }}
        />
    );
}
