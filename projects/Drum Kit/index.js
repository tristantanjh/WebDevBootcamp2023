const btns = document.querySelectorAll(".drum")

for (i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () { // anonymous inner class
        makeSound(this.innerHTML);
        buttonAnimation(this.innerHTML);
    });
}

document.addEventListener("keydown", (event) => makeSound(event.key)); // lambda, need bracket
// function(event) {
//     makeSound(event.key);
// });

document.addEventListener("keydown", (event) => buttonAnimation(event.key));

function makeSound(key) {
    switch(key) {
        case "w":
            new Audio('./sounds/crash.mp3').play();
            break;
        case "a":
            new Audio('./sounds/kick-bass.mp3').play();
            break;
        case "s":
            new Audio('./sounds/snare.mp3').play();
            break;
        case "d":
            new Audio('./sounds/tom-1.mp3').play();
            break;
        case "j":
            new Audio('./sounds/tom-2.mp3').play();
            break;
        case "k":
            new Audio('./sounds/tom-3.mp3').play();
            break;
        case "l":
            new Audio('./sounds/tom-4.mp3').play();
            break;
        default:
            console.log(key);
            break;
    }
}

function buttonAnimation(key) {
    const button = document.querySelector("." + key);
    button.classList.add("pressed");
    setTimeout(() => button.classList.remove("pressed"), 100);
}