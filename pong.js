(function () {
    var targetFps = 60;
    var Game = {};

    var backgroundColor = "black";
    var paddleColor = "white";
    var paddleWidth = 10;
    var paddleHeight = 50;

    var gameWindow = document.getElementById("gameWindow");

    // TODO: Figure out how to get this to animate smoothly to the new location
    var processKeyboardInput = function (e) {
        if (e.code === "ArrowDown") {
            playerOne.y += 10;
        } else if (e.code === "ArrowUp") {
            playerOne.y -= 10;
        }
    };

    window.addEventListener("keydown", processKeyboardInput, false);

    var canvas = {
        height: parseInt(gameWindow.getAttribute("height")),
        width: parseInt(gameWindow.getAttribute("width"))
    };

    var randomBoolean = function () {
        return Math.random() < 0.5;
    };

    var offsetFromEdge = 20;
    var playerOne = {};

    var playerTwo = {};

    var ball = {};
    var resetBall = function () {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.color = "white";

        var absoluteX = Math.random() * 200 + 100;
        var absoluteY = Math.random() * 300;
        ball.velocity = {
            x: randomBoolean() ? absoluteX : -1 * absoluteX,
            y: randomBoolean() ? absoluteY : -1 * absoluteY
        };
        ball.radius = 6;
    };

    Game.initialize = function () {
        playerOne.score = 0;
        playerOne.x = offsetFromEdge;
        playerOne.y = canvas.height / 2;

        playerTwo.score = 0;
        playerTwo.x = canvas.width - offsetFromEdge;
        playerTwo.y = canvas.height / 2;

        resetBall();
    };

    var lastUpdate = Date.now();
    Game.update = function () {
        var now = Date.now();
        var timePassed = now - lastUpdate;
        lastUpdate = now;
        var multiplier = timePassed / 1000;

        ball.x += ball.velocity.x * multiplier;
        ball.y += ball.velocity.y * multiplier;

        if (ball.x - ball.radius < 0) {
            playerTwo.score++;
            resetBall();
        } else if (ball.x + ball.radius > canvas.width) {
            playerOne.score++;
            resetBall();
        } else {
            if (ball.y - ball.radius < 0 || canvas.height < ball.y - ball.radius) {
                ball.velocity.y *= -1;
            }
        }

        if (ball.x <= playerOne.x + paddleWidth / 2 && ball.x >= playerOne.x - paddleWidth / 2) {
            if (ball.y >= playerOne.y - paddleHeight / 2 && ball.y <= playerOne.y + paddleHeight / 2) {
                // player one hit
                ball.velocity.x *= -1;
            }
        } else if (ball.x >= playerTwo.x - paddleWidth / 2 && ball.x <= playerTwo.x + paddleWidth / 2) {
            if (ball.y >= playerTwo.y - paddleHeight / 2 && ball.y <= playerTwo.y + paddleHeight / 2) {
                // player two hit
                ball.velocity.x *= -1;
            }
        }

        if (playerOne.y + paddleHeight / 2 > canvas.height) {
            playerOne.y = canvas.height - paddleHeight / 2;
        }

        if (playerTwo.y + paddleHeight / 2 > canvas.height) {
            playerTwo.y = canvas.height - paddleHeight / 2;
        }

        if (playerOne.y - paddleHeight / 2 < 0) {
            playerOne.y = paddleHeight / 2;
        }

        if (playerTwo.y - paddleHeight < 0) {
            playerTwo.y = paddleHeight / 2;
        }
    };

    Game.render = function () {
        var context = gameWindow.getContext("2d");

        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = paddleColor;
        var players = [playerOne, playerTwo];
        players.forEach(function (player) {
            context.fillRect(player.x - paddleWidth / 2, player.y - paddleHeight / 2, paddleWidth, paddleHeight);
        });

        context.fillStyle = ball.color;
        context.beginPath();
        context.arc(ball.x - ball.radius / 2, ball.y - ball.radius / 2, ball.radius, 0, 2 * Math.PI);
        context.fill();

        var scoreString = playerOne.score + " : " + playerTwo.score;
        context.font = "24px courier";
        context.textAlign = "center";
        context.fillText(scoreString, canvas.width / 2, 30);
    };

    Game.run = function () {
        Game.update();
        Game.render();
    };

    Game.initialize();
    setInterval(Game.run, 1000 / targetFps);
})();