(function () {
    var Game = {};

    var backgroundColor = "black";
    var paddleColor = "white";
    var paddleWidth = 10;
    var paddleHeight = 50;

    var gameWindow = document.getElementById("gameWindow");
    var canvas = {
        height: parseInt(gameWindow.getAttribute("height")),
        width: parseInt(gameWindow.getAttribute("width"))
    };

    var offsetFromEdge = 20;
    var playerOne = {};

    var playerTwo = {};

    var ball = {};
    var resetBall = function () {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.color = "white";
        ball.velocity = {
            x: Math.random() * 10 - 5,
            y: Math.random() * 10 - 5
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

    Game.update = function () {
        ball.x += ball.velocity.x;
        ball.y += ball.velocity.y;

        if (ball.x < 0) {
            playerTwo.score++;
            resetBall();
        } else if (ball.x > canvas.width) {
            playerOne.score++;
            resetBall();
        } else {
            if (ball.y - ball.radius < 0 || canvas.height < ball.y - ball.radius) {
                ball.velocity.y *= -1;
            }
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
    setInterval(Game.run, 16);
})();