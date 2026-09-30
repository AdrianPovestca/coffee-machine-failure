(() => {
    const $ = (selector, root = document) => root.querySelector(selector);

    const scene = $("#scene");
    const makeCoffee = $("#makeCoffee");

    const statusText = $("#statusText");
    const machineDisplay = $("#machineDisplay");
    const heroMessage = $("#heroMessage");

    const failureMessage = $("#failureMessage");
    const screenFlash = $("#screenFlash");
    const flowerDelivery = $("#flowerDelivery");

    const gaugeNeedle = $("#gaugeNeedle");
    const coffeeLiquid = $(".coffee-liquid");
    const crema = $(".crema");

    if (!scene || !makeCoffee) return;

    let running = false;
    let timers = [];

    /* ---------------------------------------------
       TIMER SYSTEM
    --------------------------------------------- */

    function later(callback, delay) {
        const timer = setTimeout(callback, delay);
        timers.push(timer);
        return timer;
    }

    function clearTimers() {
        timers.forEach(clearTimeout);
        timers = [];
    }

    /* ---------------------------------------------
       SAFE TEXT
    --------------------------------------------- */

    function setText(element, text) {
        if (element) {
            element.textContent = text;
        }
    }

    /* ---------------------------------------------
       RESTART CSS ANIMATION
    --------------------------------------------- */

    function replayAnimation(element) {
        if (!element) return;

        element.style.animation = "none";

        void element.offsetWidth;

        element.style.animation = "";
    }

    /* ---------------------------------------------
       RESET COFFEE
    --------------------------------------------- */

    function resetCoffee() {
        if (!coffeeLiquid) return;

        coffeeLiquid.style.animation = "none";
        coffeeLiquid.style.transform = "scaleY(0)";

        void coffeeLiquid.offsetWidth;

        coffeeLiquid.style.animation = "";
    }

    /* ---------------------------------------------
       RESET EVERYTHING
    --------------------------------------------- */

    function resetScene() {
        clearTimers();

        running = false;

        scene.classList.remove(
            "brewing",
            "impact",
            "shattered",
            "failed",
            "running",
            "flowers"
        );

        if (failureMessage) {
            failureMessage.classList.remove("show");
        }

        if (flowerDelivery) {
            flowerDelivery.classList.remove("show");
        }

        if (screenFlash) {
            screenFlash.classList.remove("flash");
        }

        resetCoffee();

        if (crema) {
            crema.style.opacity = "0";
        }

        if (gaugeNeedle) {
            gaugeNeedle.style.transform = "rotate(-40deg)";
        }

        setText(statusText, "SYSTEM READY");
        setText(machineDisplay, "READY");
        setText(
            heroMessage,
            "One perfectly normal espresso."
        );

        makeCoffee.disabled = false;
        makeCoffee.style.opacity = "1";
        makeCoffee.style.pointerEvents = "auto";
    }

    /* ---------------------------------------------
       MAIN 5.6 SECOND CINEMATIC SEQUENCE
    --------------------------------------------- */

    function startSequence() {

        if (running) return;

        running = true;

        clearTimers();

        /* clean previous state */

        scene.classList.remove(
            "impact",
            "shattered",
            "failed",
            "running",
            "flowers"
        );

        if (failureMessage) {
            failureMessage.classList.remove("show");
        }

        if (flowerDelivery) {
            flowerDelivery.classList.remove("show");
        }

        if (screenFlash) {
            screenFlash.classList.remove("flash");
        }

        /*
            IMPORTANT:
            Glass starts completely empty.
        */

        resetCoffee();

        if (crema) {
            crema.style.opacity = "0";
        }

        /* Disable button during cinematic */

        makeCoffee.disabled = true;
        makeCoffee.style.opacity = "0.55";
        makeCoffee.style.pointerEvents = "none";

        /* -----------------------------------------
           0.00
           MACHINE START
        ----------------------------------------- */

        setText(statusText, "PULLING SHOTS");
        setText(machineDisplay, "BREWING");
        setText(heroMessage, "Please wait...");

        scene.classList.add("brewing");

        /* -----------------------------------------
           0.28
           PRESSURE STARTS
        ----------------------------------------- */

        later(() => {

            setText(machineDisplay, "PRESSURE");

            if (gaugeNeedle) {
                gaugeNeedle.style.transform =
                    "rotate(5deg)";
            }

        }, 280);

        /* -----------------------------------------
           0.72
           EXTRACTION
        ----------------------------------------- */

        later(() => {

            setText(statusText, "EXTRACTION");
            setText(machineDisplay, "PULLING SHOT");

            if (gaugeNeedle) {
                gaugeNeedle.style.transform =
                    "rotate(21deg)";
            }

        }, 720);

        /* -----------------------------------------
           1.12
           CREMA APPEARS
        ----------------------------------------- */

        later(() => {

            if (crema) {
                crema.style.opacity = "0.9";
            }

            setText(statusText, "ESPRESSO");

        }, 1120);

        /* -----------------------------------------
           1.65
           PRESSURE RISING
        ----------------------------------------- */

        later(() => {

            if (gaugeNeedle) {
                gaugeNeedle.style.transform =
                    "rotate(31deg)";
            }

        }, 1650);

        /* -----------------------------------------
           2.28
           PRESSURE FAILURE
        ----------------------------------------- */

        later(() => {

            setText(statusText, "PRESSURE ERROR");

            setText(
                machineDisplay,
                "UNSTABLE"
            );

            setText(
                heroMessage,
                "Something feels... wrong."
            );

            scene.classList.add("impact");

            if (gaugeNeedle) {
                gaugeNeedle.style.transform =
                    "rotate(48deg)";
            }

        }, 2280);

        /* -----------------------------------------
           2.66
           GLASS BREAKS
        ----------------------------------------- */

        later(() => {

            scene.classList.remove(
                "brewing",
                "impact"
            );

            scene.classList.add("shattered");

            setText(
                statusText,
                "SYSTEM FAILURE"
            );

            setText(
                machineDisplay,
                "ERROR"
            );

            setText(
                heroMessage,
                "That was not supposed to happen."
            );

            /* Restart glass animation */

            replayAnimation(
                $("#glassCup")
            );

            replayAnimation(
                $("#glassShards")
            );

            replayAnimation(
                $("#coffeeExplosion")
            );

            /* Camera / screen flash */

            if (screenFlash) {

                screenFlash.classList.remove(
                    "flash"
                );

                void screenFlash.offsetWidth;

                screenFlash.classList.add(
                    "flash"
                );
            }

        }, 2660);

        /* -----------------------------------------
           3.01
           BARISTA PANICS
        ----------------------------------------- */

        later(() => {

            scene.classList.add("failed");

            if (failureMessage) {
                failureMessage.classList.add(
                    "show"
                );
            }

            setText(
                statusText,
                "BARISTA PANIC"
            );

            setText(
                machineDisplay,
                "NO COFFEE"
            );

        }, 3010);

        /* -----------------------------------------
           3.49
           BARISTA RUNS
        ----------------------------------------- */

        later(() => {

            if (failureMessage) {
                failureMessage.classList.remove(
                    "show"
                );
            }

            scene.classList.add("running");

            setText(
                statusText,
                "ALTERNATIVE SOLUTION"
            );

        }, 3490);

        /* -----------------------------------------
           3.97
           FLOWERS ENTER
        ----------------------------------------- */

        later(() => {

            scene.classList.add("flowers");

            if (flowerDelivery) {
                flowerDelivery.classList.add(
                    "show"
                );
            }

            setText(
                statusText,
                "DELIVERY COMPLETE"
            );

            setText(
                machineDisplay,
                "FLOWERS"
            );

        }, 3970);

        /* -----------------------------------------
           4.74
           FINAL MESSAGE
        ----------------------------------------- */

        later(() => {

            setText(
                heroMessage,
                "Coffee failed. Flowers didn't."
            );

        }, 4740);

        /* -----------------------------------------
           5.60
           READY AGAIN
        ----------------------------------------- */

        later(() => {

            running = false;

            makeCoffee.disabled = false;
            makeCoffee.style.opacity = "1";
            makeCoffee.style.pointerEvents = "auto";

            setText(
                statusText,
                "SYSTEM READY"
            );

        }, 5600);
    }

    /* ---------------------------------------------
       BUTTON
    --------------------------------------------- */

    makeCoffee.addEventListener(
        "click",
        startSequence
    );

    /* ---------------------------------------------
       KEYBOARD
       ENTER = PLAY
       R = RESET
    --------------------------------------------- */

    document.addEventListener(
        "keydown",
        event => {

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

    /* ---------------------------------------------
       DOUBLE CLICK = RESET
    --------------------------------------------- */

    scene.addEventListener(
        "dblclick",
        resetScene
    );

    /* ---------------------------------------------
       INITIAL STATE
    --------------------------------------------- */

    resetScene();

})();
