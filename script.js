const scene = document.getElementById("scene");

const makeCoffee = document.getElementById("makeCoffee");

const coffeeSplash =
    document.getElementById("coffeeSplash");

const flowerDelivery =
    document.getElementById("flowerDelivery");

const failureMessage =
    document.getElementById("failureMessage");

const screenFlash =
    document.getElementById("screenFlash");

const machineStatus =
    document.getElementById("machineStatus");

const statusText =
    document.getElementById("statusText");

const instruction =
    document.getElementById("instruction");


let isRunning = false;


/* ==================================================
   WAIT
================================================== */

function wait(milliseconds) {

    return new Promise(resolve => {

        setTimeout(
            resolve,
            milliseconds
        );

    });

}


/* ==================================================
   COFFEE SPLASH
================================================== */

function createSplash() {

    const particles =
        coffeeSplash.querySelectorAll("span");

    const positions = [

        ["-95px", "-75px"],
        ["75px", "-90px"],
        ["-120px", "15px"],
        ["115px", "30px"],
        ["-65px", "75px"],
        ["70px", "85px"]

    ];


    particles.forEach(
        (particle, index) => {

            const [x, y] =
                positions[index];

            particle.style.setProperty(
                "--x",
                x
            );

            particle.style.setProperty(
                "--y",
                y
            );


            particle.style.animation =
                "none";


            void particle.offsetWidth;


            particle.style.animation =
                "splash 0.65s cubic-bezier(.2,.8,.2,1) forwards";

        }
    );

}


/* ==================================================
   FLASH
================================================== */

function flashScreen() {

    screenFlash.animate(

        [
            {
                opacity: 0
            },

            {
                opacity: 1
            },

            {
                opacity: 0
            }
        ],

        {
            duration: 300,
            easing: "ease-out"
        }

    );

}


/* ==================================================
   MAIN SEQUENCE
================================================== */

async function makeCoffeeSequence() {

    if (isRunning) {
        return;
    }


    isRunning = true;


    makeCoffee.disabled =
        true;

    makeCoffee.style.opacity =
        "0.5";


    /* ----------------------------------------------
       1. BREWING
    ---------------------------------------------- */

    scene.classList.add(
        "brewing"
    );


    machineStatus.textContent =
        "BREWING";


    statusText.textContent =
        "PULLING SHOTS";


    instruction.textContent =
        "Please wait...";


    await wait(2900);


    /* ----------------------------------------------
       2. FAILURE
    ---------------------------------------------- */

    scene.classList.remove(
        "brewing"
    );


    scene.classList.add(
        "shake"
    );


    machineStatus.textContent =
        "ERROR";


    statusText.textContent =
        "SYSTEM FAILURE";


    instruction.textContent =
        "Oh.";


    flashScreen();


    createSplash();


    scene.classList.add(
        "exploded"
    );


    await wait(300);


    /* ----------------------------------------------
       3. BARISTA REACTION
    ---------------------------------------------- */

    scene.classList.add(
        "failed"
    );


    failureMessage.classList.add(
        "show"
    );


    await wait(1150);


    /* ----------------------------------------------
       4. BARISTA LEAVES
    ---------------------------------------------- */

    failureMessage.classList.remove(
        "show"
    );


    scene.classList.add(
        "flower-mode"
    );


    await wait(550);


    /* ----------------------------------------------
       5. FLOWERS
    ---------------------------------------------- */

    flowerDelivery.classList.add(
        "show"
    );


    statusText.textContent =
        "ALTERNATIVE SOLUTION";


    machineStatus.textContent =
        "FLOWERS";


    instruction.textContent =
        "This is for you.";

}


/* ==================================================
   BUTTON
================================================== */

makeCoffee.addEventListener(
    "click",
    makeCoffeeSequence
);


/* ==================================================
   SPACEBAR
================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.code === "Space" &&
            !isRunning
        ) {

            event.preventDefault();

            makeCoffeeSequence();

        }

    }
);
