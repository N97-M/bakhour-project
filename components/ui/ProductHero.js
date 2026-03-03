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

            {/* Product area with internal smoke positioned relative to the lid */}
            <div className={styles.jarWrapper}>
                <div className={styles.smokeContainer}>
                    <SmokeCanvas />
                </div>
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
