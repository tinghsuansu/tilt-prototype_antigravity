let currentState = 'flat';
let lastAngle = 0;

const body = document.body;
const debugAngle = document.getElementById('debug-angle');
const debugState = document.getElementById('debug-state');
const toggleBtn = document.getElementById('toggle-state');

function updateState(newState) {
    if (currentState === newState) return;
    
    currentState = newState;
    body.className = `state-${newState}`;
    debugState.textContent = newState.charAt(0).toUpperCase() + newState.slice(1);
}

// Manual Toggle for Desktop Testing
toggleBtn.addEventListener('click', () => {
    const nextState = currentState === 'flat' ? 'upright' : 'flat';
    updateState(nextState);
});

// Device Orientation Handling
window.addEventListener('deviceorientation', (event) => {
    const beta = event.beta; // -180 to 180
    if (beta === null) return;

    const angle = Math.round(beta);
    debugAngle.textContent = angle;

    // Thresholds: Flat (0-30°), Upright (60-90°)
    if (angle < 30) {
        updateState('flat');
    } else if (angle > 60) {
        updateState('upright');
    }
    // Between 30 and 60, we stay in the current state (hysteresis)
});

// For iOS (Requires permission)
if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    toggleBtn.addEventListener('click', () => {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response == 'granted') {
                    console.log("DeviceOrientation permission granted");
                }
            })
            .catch(console.error);
    }, { once: true });
}
