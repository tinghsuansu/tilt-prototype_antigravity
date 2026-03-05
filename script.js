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
    const orientation = window.orientation || 0;
    let beta = event.beta;
    let gamma = event.gamma;

    if (beta === null || gamma === null) return;

    let angle = 0;

    // Normalize tilt angle based on screen orientation
    if (Math.abs(orientation) === 90) {
        // Landscape: Tilt is primarily reported in gamma
        // When rotated 90 deg (landscape-primary), gamma is tilt towards/away from user
        angle = Math.abs(Math.round(gamma));
    } else {
        // Portrait (0 or 180): Tilt is reported in beta
        angle = Math.abs(Math.round(beta));
    }

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
