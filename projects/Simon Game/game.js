$(document).ready(startGame);
    
function startGame() {
    var buttonColors = ["red", "blue", "green", "yellow"];
    var randomNum = 0;
    var gamePattern = [];
    var userClickedPattern = [];
    var level = 0;
    var index = 0;
    var gameOver = false;
    
    function playSound(color) {
        var audio = new Audio("./sounds/" + color + ".mp3");
        audio.play();
    }
    
    function animatePress(color) {
        $("#" + color).addClass("pressed");
        setTimeout(function () {
            $("#" + color).removeClass("pressed")
        }, 200);
    }
    
    function nextSequence() {
        randomNum = Math.floor(Math.random() * 3);
        var randomColor = buttonColors[randomNum];
        gamePattern.push(randomColor);
        animatePress(randomColor);
        playSound(randomColor);
        level++;
        $("h1").html("Level " + level);
    }
    
    $("body").on("keypress", function() {
        if (level === 0) {
            nextSequence();
        }
    });
    
    $(".btn").on("click", function() {
        if (gamePattern.length === 0) {
            return;
        }
        if (!gameOver) { // ensures clicking after loss does nothing
            var userChosenColour = $(this).attr("id");
            userClickedPattern.push(userChosenColour);
            playSound(userChosenColour);
            animatePress(userChosenColour);
            var answer = checkAnswer(index);
            if (answer === false) {
                playSound("wrong");
                $("body").addClass("game-over");
                setTimeout(function () {
                    $("body").removeClass("game-over")
                }, 200);
                $("h1").html("Game over, Press any key to Restart");
                gameOver = true;
                $(document).one("keypress", function() { // fxn "one" ensures event triggered only once
                    gamePattern = [];
                    userClickedPattern = [];
                    level = 0;
                    index = 0;
                    gameOver = false;
                    nextSequence();
                });
            }
            index++;
            if (userClickedPattern.length === gamePattern.length) {
                userClickedPattern = [];
                index = 0;
                if (answer === true) {
                    setTimeout(function() {
                        nextSequence();
                    }, 1000);
                }
            }
        }
    });
    
    function checkAnswer(index) {
        if (gamePattern[index] !== userClickedPattern[index]) {
            return false;
        }
        return true;
    }
}