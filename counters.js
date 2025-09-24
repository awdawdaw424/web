document.addEventListener('DOMContentLoaded', () => {
    // Views counter with base value of 336
    const viewCounter = document.getElementById('viewCounter');
    if (viewCounter) {
        // Ha még nincs érték, kezdjük 336-ról
        if (!localStorage.getItem('views')) {
            localStorage.setItem('views', '336');
        }
        // Növeljük eggyel a látogatásszámot
        let views = parseInt(localStorage.getItem('views')) + 1;
        localStorage.setItem('views', views.toString());
        viewCounter.textContent = views.toLocaleString('hu-HU');
    }

    // FPS counter
    const fpsCounter = document.getElementById('fpsCounter');
    if (fpsCounter) {
        let lastTime = performance.now();
        let frames = 0;

        function updateFPS() {
            const now = performance.now();
            frames++;

            if (now - lastTime >= 1000) {
                fpsCounter.textContent = frames;
                frames = 0;
                lastTime = now;
            }

            requestAnimationFrame(updateFPS);
        }

        updateFPS();
    }

    // Heart counter
    const heartBtn = document.getElementById('heartBtn');
    const heartCounter = document.getElementById('heartCounter');
    
    if (heartBtn && heartCounter) {
        // Check if user has already liked
        const hasLiked = localStorage.getItem('hasLiked') === 'true';
        if (hasLiked) {
            heartBtn.classList.add('active');
        }

        // Initialize heart count to 289 if not set
        if (!localStorage.getItem('hearts')) {
            localStorage.setItem('hearts', '289');
        }
        let hearts = parseInt(localStorage.getItem('hearts'));
        heartCounter.textContent = hearts.toLocaleString('hu-HU');

        // Handle heart button click
        heartBtn.addEventListener('click', () => {
            const hasLiked = localStorage.getItem('hasLiked') === 'true';
            
            if (!hasLiked) {
                // Increment hearts
                hearts++;
                localStorage.setItem('hearts', hearts.toString());
                heartCounter.textContent = hearts.toLocaleString('hu-HU');
                
                // Mark as liked
                localStorage.setItem('hasLiked', 'true');
                heartBtn.classList.add('active');
            } else {
                // Decrement hearts
                hearts--;
                localStorage.setItem('hearts', hearts.toString());
                heartCounter.textContent = hearts.toLocaleString('hu-HU');
                
                // Remove like
                localStorage.setItem('hasLiked', 'false');
                heartBtn.classList.remove('active');
            }
        });
    }
});
