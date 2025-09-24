// Counter logic
let frameCount = 0;
let lastTime = performance.now();
let fps = 60;

function updateFPS() {
    const now = performance.now();
    frameCount++;

    if (now - lastTime >= 1000) {
        fps = frameCount;
        document.getElementById('fpsCounter').textContent = fps;
        frameCount = 0;
        lastTime = now;
    }
    requestAnimationFrame(updateFPS);
}

// Start FPS counter
updateFPS();

// Views counter
async function updateViewCounter() {
    try {
        const response = await fetch('https://api.countapi.xyz/hit/anubis-site/visits');
        const data = await response.json();
        document.getElementById('viewCounter').textContent = data.value.toLocaleString('hu-HU');
    } catch {
        // Fallback: local storage counter
        let views = parseInt(localStorage.getItem('viewCount') || '0');
        views++;
        localStorage.setItem('viewCount', views.toString());
        document.getElementById('viewCounter').textContent = views.toLocaleString('hu-HU');
    }
}

// Update views on page load
updateViewCounter();
