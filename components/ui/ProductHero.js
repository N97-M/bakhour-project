'use client';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import styles from './ProductHero.module.css';

const SmokeCanvas = dynamic(() => import('./SmokeCanvas'), { ssr: false });

export default function ProductHero() {
    return (
        <div className={styles.wrapper}>
            {/* Ambient glow behind jar */}
            <div className={styles.glowRing} />

            {/* Smoke canvas — z-index 1, BEHIND the jar image */}
            <div className={styles.smokeArea}>
                <SmokeCanvas />
            </div>

            {/* Product image — z-index 2, IN FRONT of smoke */}
            <div className={styles.jarWrapper}>
                <Image
                    src="/product-hero.png"
                    alt="Al Dalal Bakhour - Premium Sudanese Incense Jar"
                    width={500}
                    height={650}
                    priority
                    className={styles.jarImage}
                    style={{ objectFit: 'contain' }}
                />
            </div>
        </div>
    );
}
