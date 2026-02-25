/**
 * flyToCart — animates a small gold orb from button position to the cart icon.
 * @param {MouseEvent} e  — the click event from the Add to Cart button
 */
export function flyToCart(e) {
    const cartEl = document.getElementById('cart-icon');
    if (!cartEl) return;

    const btnRect = e.currentTarget.getBoundingClientRect();
    const cartRect = cartEl.getBoundingClientRect();

    // Start position: centre of the clicked button
    const startX = btnRect.left + btnRect.width / 2;
    const startY = btnRect.top + btnRect.height / 2;

    // End position: centre of the cart icon
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;

    // Create the flying orb
    const orb = document.createElement('div');
    orb.style.cssText = `
        position: fixed;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: radial-gradient(circle at 35% 35%, #f0d590, #C6A75E);
        box-shadow: 0 0 12px rgba(198,167,94,0.9), 0 0 4px rgba(198,167,94,0.5);
        pointer-events: none;
        z-index: 99999;
        left: ${startX - 7}px;
        top: ${startY - 7}px;
        transform: scale(1);
        transition: none;
    `;
    document.body.appendChild(orb);

    // Animate using Web Animations API
    const dx = endX - startX;
    const dy = endY - startY;
    const arcHeight = Math.min(Math.abs(dy) * 0.6, 120); // arc up-ward

    orb.animate(
        [
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${dx * 0.5}px, ${-arcHeight}px) scale(0.85)`, opacity: 1, offset: 0.4 },
            { transform: `translate(${dx}px, ${dy}px) scale(0.3)`, opacity: 0.6 },
        ],
        {
            duration: 650,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards',
        }
    ).onfinish = () => {
        orb.remove();
        // Bounce the cart icon
        cartEl.animate(
            [
                { transform: 'scale(1)' },
                { transform: 'scale(1.4)' },
                { transform: 'scale(0.9)' },
                { transform: 'scale(1.15)' },
                { transform: 'scale(1)' },
            ],
            { duration: 400, easing: 'ease-out' }
        );
    };
}
