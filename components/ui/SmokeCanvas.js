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
            const dpr = window.devicePixelRatio || 1;
            W = canvas.offsetWidth;
            H = canvas.offsetHeight;

            if (W === 0 || H === 0) return false;

            canvas.width = W * dpr;
            canvas.height = H * dpr;
            ctx.scale(dpr, dpr);
            return true;
        };

        // Local coordinates (Relative to the SmokeContainer)
        // The container is centered on the lid, so origin is bottom-center
        const getOriginX = () => W * 0.5;
        const getOriginY = () => H;

        class Tendril {
            constructor(offset = 0, delay = 0) {
                this.offset = offset;
                this.delay = delay;
                this.reset();
            }

            reset() {
                this.pts = [];
                this.age = -this.delay;
                this.life = 400 + Math.random() * 200;

                // Very slow, delicate drifting
                this.speed = 0.4 + Math.random() * 0.2;

                // Subtle curls
                this.amplitude = 8 + Math.random() * 8;
                this.freq = 0.008 + Math.random() * 0.006;

                // Thin, silk-like lines
                this.lineWidth = 0.5 + Math.random() * 0.8;

                // Low alpha for sophistication
                this.maxAlpha = 0.15 + Math.random() * 0.2;

                this.phase = Math.random() * Math.PI * 2;
            }

            update() {
                if (W === 0 || H === 0) return;

                this.age++;
                if (this.age < 0) return;

                const t = this.age;
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

                ctx.shadowBlur = W < 600 ? 12 : 8; // More glow on mobile
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
