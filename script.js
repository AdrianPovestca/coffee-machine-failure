const scene = document.getElementById("scene");
const makeCoffee = document.getElementById("makeCoffee");

const statusText = document.getElementById("statusText");
const machineDisplay = document.getElementById("machineDisplay");
const heroMessage = document.getElementById("heroMessage");

const failureMessage = document.getElementById("failureMessage");
const screenFlash = document.getElementById("screenFlash");
const flowerDelivery = document.getElementById("flowerDelivery");

const gaugeNeedle = document.getElementById("gaugeNeedle");
const espressoMachine = document.getElementById("espressoMachine");
const glassCup = document.getElementById("glassCup");
const glassShards = document.getElementById("glassShards");
const coffeeExplosion = document.getElementById("coffeeExplosion");
const barista = document.getElementById("barista");

let running = false;
let timers = [];

function later(callback, delay) {
    const timer = setTimeout(callback, delay);
    timers.push(timer);
    return timer;
}

function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
}

function restartAnimation(element) {
    if (!element) return;

    element.classList.remove("animate");

    void element.offsetWidth;

    element.classList.add("animate");
}

function resetAnimationClasses() {
    scene.classList.remove(
        "brewing",
        "impact",
        "shattered",
        "failed",
        "running",
        "flowers"
    );

    failureMessage.classList.remove("show");
    flowerDelivery.classList.remove("show");

    if (screenFlash) {
        screenFlash.classList.remove("flash");
    }

    if (glassShards) {
        glassShards.classList.remove("animate");
    }

    if (coffeeExplosion) {
        coffeeExplosion.classList.remove("animate");
    }

    if (glassCup) {
        glassCup.classList.remove("animate");
    }

    if (espressoMachine) {
        espressoMachine.classList.remove("animate");
    }

    if (barista) {
        barista.classList.remove("animate");
    }
}

function resetScene() {
    clearTimers();

    resetAnimationClasses();

    running = false;

    statusText.textContent = "SYSTEM READY";
    machineDisplay.textContent = "READY";

    heroMessage.textContent =
        "One perfectly normal espresso.";

    gaugeNeedle.style.transform = "rotate(-40deg)";

    makeCoffee.disabled = false;
    makeCoffee.style.opacity = "1";
    makeCoffee.style.pointerEvents = "auto";
}

/* =========================================================
   MAIN COFFEE SEQUENCE
========================================================= */

function startSequence() {
    if (running) return;

    running = true;

    clearTimers();
    resetAnimationClasses();

    makeCoffee.disabled = true;
    makeCoffee.style.opacity = "0.65";
    makeCoffee.style.pointerEvents = "none";

    /*
        0.00
        START
    */

    statusText.textContent = "PULLING SHOTS";
    machineDisplay.textContent = "BREWING";

    heroMessage.textContent =
        "Please wait...";

    scene.classList.add("brewing");

    restartAnimation(espressoMachine);

    /*
        0.20
        MACHINE STARTS SHAKING
    */

    later(() => {
        machineDisplay.textContent = "PRESSURE";

        gaugeNeedle.style.transform =
            "rotate(5deg)";
    }, 200);

    /*
        0.70
        FIRST EXTRACTION
    */

    later(() => {
        statusText.textContent =
            "EXTRACTION";

        machineDisplay.textContent =
            "PULLING SHOT";

        gaugeNeedle.style.transform =
            "rotate(22deg)";
    }, 700);

    /*
        1.45
        SECOND SHOT
    */

    later(() => {
        statusText.textContent =
            "ESPRESSO";

        gaugeNeedle.style.transform =
            "rotate(31deg)";
    }, 1450);

    /*
        2.45
        SOMETHING IS GOING WRONG
    */

    later(() => {
        statusText.textContent =
            "PRESSURE ERROR";

        machineDisplay.textContent =
            "UNSTABLE";

        heroMessage.textContent =
            "Something feels... wrong.";

        scene.classList.add("impact");

        gaugeNeedle.style.transform =
            "rotate(48deg)";
    }, 2450);

    /*
        2.82
        IMPACT / GLASS STARTS BREAKING
    */

    later(() => {
        scene.classList.remove("brewing");

        scene.classList.add("shattered");

        statusText.textContent =
            "SYSTEM FAILURE";

        machineDisplay.textContent =
            "ERROR";

        heroMessage.textContent =
            "That was not supposed to happen.";

        restartAnimation(glassCup);
        restartAnimation(glassShards);
        restartAnimation(coffeeExplosion);

        if (screenFlash) {
            screenFlash.classList.remove("flash");

            void screenFlash.offsetWidth;

            screenFlash.classList.add("flash");
        }
    }, 2820);

    /*
        3.08
        BARISTA REALIZES WHAT HAPPENED
    */

    later(() => {
        scene.classList.remove("impact");

        scene.classList.add("failed");

        failureMessage.classList.add("show");

        statusText.textContent =
            "BARISTA PANIC";

        machineDisplay.textContent =
            "NO COFFEE";
    }, 3080);

    /*
        3.72
        BARISTA RUNS AWAY
    */

    later(() => {
        failureMessage.classList.remove("show");

        scene.classList.add("running");

        statusText.textContent =
            "ALTERNATIVE SOLUTION";
    }, 3720);

    /*
        4.18
        FLOWERS ENTER THE SCREEN
    */

    later(() => {
        scene.classList.add("flowers");

        flowerDelivery.classList.add("show");

        statusText.textContent =
            "DELIVERY COMPLETE";

        machineDisplay.textContent =
            "FLOWERS";
    }, 4180);

    /*
        4.85
        FINAL MESSAGE
    */

    later(() => {
        heroMessage.textContent =
            "Coffee failed. Flowers didn't.";

    }, 4850);

    /*
        5.30
        USER CAN RUN IT AGAIN
    */

    later(() => {
        running = false;

        makeCoffee.disabled = false;
        makeCoffee.style.opacity = "1";
        makeCoffee.style.pointerEvents = "auto";

        statusText.textContent =
            "SYSTEM READY";
    }, 5300);
}

/* =========================================================
   BUTTON
========================================================= */

makeCoffee.addEventListener(
    "click",
    startSequence
);

/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

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
    }
);

/* =========================================================
   DOUBLE CLICK = RESET
========================================================= */

scene.addEventListener(
    "dblclick",
    resetScene
);

/* =========================================================
   INITIAL STATE
========================================================= */

resetScene();
