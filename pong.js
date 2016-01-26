(function () {
    var Game = {};

    var paddleColor = "white";
    var paddleWidth = 10;
    var paddleHeight = 50;
    var playerSpeed = 200;

    var gameWindow = document.getElementById("gameWindow");

    var processKeyboardInput = function (e) {
        if (e.type == "keydown") {
            if (e.code === "ArrowDown") {
                playerOne.velocity.y = playerSpeed;
            } else if (e.code === "ArrowUp") {
                playerOne.velocity.y = -playerSpeed;
            }
        } else if (e.type == "keyup") {
            if (e.code === "ArrowDown") {
                if (playerOne.velocity.y > 0) {
                    playerOne.velocity.y = 0;
                }
            } else if (e.code === "ArrowUp") {
                if (playerOne.velocity.y < 0) {
                    playerOne.velocity.y = 0;
                }
            } else if (e.code === "KeyR") {
                Game.initialize();
            }
        }
    };

    var touchStart = function (e) {
        e.preventDefault();
        if (e.touches[0].clientY < canvas.height / 2) {
            playerOne.velocity.y = -playerSpeed;
        } else {
            playerOne.velocity.y = playerSpeed;
        }
    };

    var touchEnd = function (e) {
        e.preventDefault();
        playerOne.velocity.y = 0;
    };

    window.addEventListener("keydown", processKeyboardInput, false);
    window.addEventListener("keyup", processKeyboardInput, false);
    gameWindow.addEventListener("touchstart", touchStart, false);
    gameWindow.addEventListener("touchend", touchEnd, false);

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

    Game.initialize = function (ai) {
        Game.ai = ai;

        playerOne.score = 0;
        playerOne.x = offsetFromEdge;
        playerOne.y = canvas.height / 2;
        playerOne.velocity = {
            x: 0,
            y: 0
        };

        playerTwo.score = 0;
        playerTwo.x = canvas.width - offsetFromEdge;
        playerTwo.y = canvas.height / 2;
        playerTwo.velocity = {
            x: 0,
            y: 0
        };

        resetBall();
    };

    var lastUpdate = window.performance.now();
    Game.update = function () {
        Game.ai(playerTwo, playerOne, ball);

        var now = window.performance.now();
        var timePassed = now - lastUpdate;
        lastUpdate = now;
        var multiplier = timePassed / 1000.;
        Game.framesPerSecond = Math.round(1000 / timePassed);

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
                ball.velocity.x *= -(1 + Math.random());
            }
        } else if (ball.x >= playerTwo.x - paddleWidth / 2 && ball.x <= playerTwo.x + paddleWidth / 2) {
            if (ball.y >= playerTwo.y - paddleHeight / 2 && ball.y <= playerTwo.y + paddleHeight / 2) {
                // player two hit
                ball.velocity.x *= -(1 + Math.random());
            }
        }

        playerOne.y += playerOne.velocity.y * multiplier;
        playerTwo.y += playerTwo.velocity.y * multiplier;

        if (playerOne.y + paddleHeight / 2 > canvas.height) {
            playerOne.y = canvas.height - paddleHeight / 2;
        }

        if (playerTwo.y + paddleHeight / 2 > canvas.height) {
            playerTwo.y = canvas.height - paddleHeight / 2;
        }

        if (playerOne.y - paddleHeight / 2 < 0) {
            playerOne.y = paddleHeight / 2;
        }

        if (playerTwo.y - paddleHeight / 2 < 0) {
            playerTwo.y = paddleHeight / 2;
        }
    };

    Game.render = function () {
        var context = gameWindow.getContext("2d");

        // TODO: Find better way to do movement trails
        context.fillStyle = 'rgba(0,0,0,0.3)';
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
        context.font = "30px courier";
        context.textAlign = "center";
        context.fillText(scoreString, canvas.width / 2, 30);

        context.font = "10px courier";
        context.textAlign = "end";
        context.fillText("FPS: " + Game.framesPerSecond, canvas.width, canvas.height);
    };

    Game.run = function () {
        window.requestAnimationFrame(Game.run);
        Game.update();
        Game.render();
    };

    var ai = {};
    ai.perfect = function (self, opponent, ball) {
        self.y = ball.y;
    };

    ai.simple = function (self, opponent, ball) {
        if (randomBoolean()) {
            var ballDirection = ball.velocity.y < 0 ? -1 : 1;
            self.velocity.y = playerSpeed * ballDirection;
        }
    };

    Game.initialize(ai.simple);
    Game.run();
})();
