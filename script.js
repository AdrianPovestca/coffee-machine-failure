const scene = document.getElementById("scene");
const makeCoffee = document.getElementById("makeCoffee");
const statusText = document.getElementById("statusText");
const machineDisplay = document.getElementById("machineDisplay");
const heroMessage = document.getElementById("heroMessage");
const failureMessage = document.getElementById("failureMessage");
const screenFlash = document.getElementById("screenFlash");
const flowerDelivery = document.getElementById("flowerDelivery");
const gaugeNeedle = document.getElementById("gaugeNeedle");

let running = false;
let timers = [];

function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
}

function later(fn, ms) {
    const timer = setTimeout(fn, ms);
    timers.push(timer);
    return timer;
}

function resetScene() {
    clearTimers();

    scene.classList.remove(
        "brewing",
        "shattered",
        "failed",
        "running"
    );

    flowerDelivery.classList.remove("show");
    failureMessage.classList.remove("show");

    statusText.textContent = "SYSTEM READY";
    machineDisplay.textContent = "READY";
    heroMessage.textContent = "One perfectly normal espresso.";

    gaugeNeedle.style.transform = "rotate(-40deg)";

    const buttonLight = document.querySelector(".machine-button.active");

    if (buttonLight) {
        buttonLight.style.animation = "";
    }

    running = false;
    makeCoffee.disabled = false;
    makeCoffee.style.opacity = "1";
}

function startSequence() {
    if (running) return;

    running = true;
    clearTimers();

    scene.classList.remove(
        "shattered",
        "failed",
        "running"
    );

    flowerDelivery.classList.remove("show");
    failureMessage.classList.remove("show");

    statusText.textContent = "PULLING SHOTS";
    machineDisplay.textContent = "BREWING";
    heroMessage.textContent = "Please wait...";

    makeCoffee.disabled = true;
    makeCoffee.style.opacity = ".72";

    scene.classList.add("brewing");

    /*
        ANIMATION TIMELINE

        0.0s  machine starts
        0.65s pressure / extraction
        2.05s almost ready
        3.05s glass breaks
        3.18s barista reacts
        3.82s barista runs away
        4.38s flowers arrive
        4.90s final message
        5.35s button becomes usable again
        5.60s final animation cleanup
    */

    later(() => {
        statusText.textContent = "EXTRACTION";
    }, 650);

    later(() => {
        statusText.textContent = "ALMOST THERE";
    }, 2050);

    /*
        GLASS BREAK
    */
    later(() => {
        scene.classList.remove("brewing");
        scene.classList.add("shattered");

        statusText.textContent = "SYSTEM FAILURE";
        machineDisplay.textContent = "ERROR";

        heroMessage.textContent = "Something went very wrong.";

        /*
            Trigger the full-screen flash animation.
            Removing + adding the class forces the browser
            to replay the animation every time.
        */
        screenFlash.classList.remove("flash");

        void screenFlash.offsetWidth;

        screenFlash.classList.add("flash");
    }, 3050);

    /*
        BARISTA REACTION
    */
    later(() => {
        scene.classList.add("failed");

        failureMessage.classList.add("show");

        statusText.textContent = "ALTERNATIVE SOLUTION";
    }, 3180);

    /*
        BARISTA RUNS AWAY
    */
    later(() => {
        failureMessage.classList.remove("show");

        scene.classList.add("running");
    }, 3820);

    /*
        FLOWERS COME INTO THE SCREEN
    */
    later(() => {
        flowerDelivery.classList.add("show");

        statusText.textContent = "THIS IS FOR YOU";
    }, 4380);

    /*
        FINAL MESSAGE
    */
    later(() => {
        machineDisplay.textContent = "FLOWERS";

        heroMessage.textContent =
            "Coffee machine failed. Flowers did not.";
    }, 4900);

    /*
        Allow the user to run the animation again.
    */
    later(() => {
        running = false;

        makeCoffee.disabled = false;
        makeCoffee.style.opacity = "1";
    }, 5350);

    /*
        Clean up the barista animation at the end.
        The flowers remain visible.
    */
    later(() => {
        scene.classList.remove(
            "failed",
            "running"
        );
    }, 5600);
}

/*
    MAIN BUTTON
*/
makeCoffee.addEventListener(
    "click",
    startSequence
);

/*
    KEYBOARD CONTROLS

    ENTER = start animation
    R     = reset
*/
document.addEventListener("keydown", (event) => {
    if (
        event.key === "Enter" &&
        !running
    ) {
        startSequence();
    }

    if (
        event.key.toLowerCase() === "r"
    ) {
        resetScene();
    }
});

/*
    DOUBLE CLICK ANYWHERE IN THE SCENE
    = quick reset

    Useful when filming because you can
    immediately prepare another take.
*/
scene.addEventListener(
    "dblclick",
    resetScene
);
