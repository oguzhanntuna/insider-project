(function () {
    var CSS = {
        arena: {
            width: 900,
            height: 600,
            background: '#62247B',
            position: 'fixed',
            top: '58%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)'
        },
        ball: {
            width: 15,
            height: 15,
            position: 'absolute',
            top: 0,
            left: 350,
            borderRadius: 50,
            background: '#C6A62F',
            display: 'block'
        },
        line: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #C6A62F',
            position: 'absolute',
            top: 0,
            left: '50%'
        },
        stick: {
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#C6A62F',
            borderRadius: 4
        },
        stick1: {
            left: 0,
            top: 150
        },
        stick2: {
            right: 0,
            top: 150
        },
        score: {
            position: 'absolute',
            top: '2%',
            color: '#C6A62F',
            fontSize: 50
        },
        score1: {
            left: '25%',
        },
        score2: {
            right: '25%'
        },
        result: {
            position: 'absolute',
            top: '40%',
            left: '20%',
            color: '#000000',
            fontSize: 70
        }
    };

    var CONSTS = {
    	gameSpeed: 20,
        score1: 0,
        score2: 0,
        stick1Speed: 0,
        stick2Speed: 0,
        ballTopSpeed: 0,
        ballLeftSpeed: 0,
        easy: 0.07,
        medium: 0.1,
        hard: 0.15,
    };

    function start() {
        if (localStorage.length) {
            loadScore();
        }
        draw();
        setEvents();
        roll(); 
        loop();
    }

    function draw() {
        $('<div/>', {id: 'pong-game'}).css(CSS.arena).appendTo('body');
        $('<div/>', {id: 'pong-line'}).css(CSS.line).appendTo('#pong-game');
        $('<div/>', {id: 'pong-ball'}).css(CSS.ball).appendTo('#pong-game');
        $('<div/>', {id: 'stick-1'}).css($.extend(CSS.stick1, CSS.stick))
        .appendTo('#pong-game');
        $('<div/>', {id: 'stick-2'}).css($.extend(CSS.stick2, CSS.stick))
        .appendTo('#pong-game');     
        $('<div/>', {id: 'score-1'}).css($.extend(CSS.score1, CSS.score)).appendTo('#pong-game') ;  
        $('<div/>', {id: 'score-2'}).css($.extend(CSS.score2, CSS.score)).appendTo('#pong-game');
        $('<div/>', {id: 'pong-result'}).css(CSS.result).appendTo('#pong-game');
    }

    // KEYBINDINGS
    function setEvents() {
        // Player1
        // Button 'w'
        $(document).on('keydown', function (e) {
            if (e.keyCode == 87 || e.which == 87) {
                CONSTS.stick1Speed = -10;
            }
        });
        $(document).on('keyup', function (e) {
            if (e.keyCode == 87 || e.which == 87) {
                CONSTS.stick1Speed = 0;
            }
        });
        // Button 's'
        $(document).on('keydown', function (e) {
            if (e.keyCode == 83 || e.which == 83) {
                CONSTS.stick1Speed = 10;
            }
        });
        $(document).on('keyup', function (e) {
            if (e.keyCode == 83 || e.which == 83) {
                CONSTS.stick1Speed = 0;
            }
        });

        //Player2
        // Up arrow
        $(document).on('keydown', function (e) {
            if (e.keyCode == 38 || e.which == 38) {
                CONSTS.stick2Speed = -10;
            }
        });
        $(document).on('keyup', function (e) {
            if (e.keyCode == 38 || e.which == 38) {
                CONSTS.stick2Speed = 0;
            }
        });
        // Down arrow
        $(document).on('keydown', function (e) {
            if (e.keyCode == 40 || e.which == 40) {
                CONSTS.stick2Speed = 10;
            }
        });
        $(document).on('keyup', function (e) {
            if (e.keyCode == 40 || e.which == 40) {
                CONSTS.stick2Speed = 0;
            }
        });

        // Saving the game on pressing button 'p'
        $(document).on('keydown', function (e) {
            if (e.keyCode == 80 || e.which == 80) {
                saveScore();  
            }
        });
    }

    function loop() {
        var intervalID = window.setInterval(function () {
            /**  MOVEMENTS OF PADDLES  **/
            // Manual sticks
            CSS.stick1.top += CONSTS.stick1Speed;   // Stick1 Manual Control
            CSS.stick2.top += CONSTS.stick2Speed;   // Stick1 Manual Control   

            // AI sticks
            CSS.stick1.top += ((CSS.ball.top - (CSS.stick1.top + CSS.stick1.height / 2))) * CONSTS.easy;  // Stick1 CPU Player
            CSS.stick2.top += ((CSS.ball.top - (CSS.stick2.top + CSS.stick2.height / 2))) * CONSTS.hard;  // Stick2 CPU Player
            
            // Stop the paddle leaving from top of the window
            if (CSS.stick1.top <= 0) {
                CSS.stick1.top = 0;
            }
            if (CSS.stick2.top <= 0) {
                CSS.stick2.top = 0;
            }

            // Stop the paddle leaving from bottom of the window
            if (CSS.stick1.top >= CSS.arena.height - CSS.stick1.height) {
                CSS.stick1.top = CSS.arena.height - CSS.stick1.height;
            }
            if (CSS.stick2.top >= CSS.arena.height - CSS.stick2.height) {
                CSS.stick2.top = CSS.arena.height - CSS.stick2.height;
            }
            $('#stick-1').css('top', CSS.stick1.top);
            $('#stick-2').css('top', CSS.stick2.top);


            /**  MOVEMENTS OF BALL  **/
            CSS.ball.top += CONSTS.ballTopSpeed;
            CSS.ball.left += CONSTS.ballLeftSpeed;

            // Make the ball change its direction, when it hits top or bottom of the screen
            if (CSS.ball.top <= 0 || CSS.ball.top >= CSS.arena.height - CSS.ball.height) {
                CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1;
            }
            $('#pong-ball').css({top: CSS.ball.top, left: CSS.ball.left});

            // Make the ball bounce from the paddles
            if (CSS.ball.left <= CSS.stick.width + CSS.stick1.left && CSS.ball.left > 0) {
                if (CSS.ball.top > CSS.stick1.top && CSS.ball.top < CSS.stick1.top + CSS.stick.height) {
                    CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1;
                } else {
                    CONSTS.score2++;
                    if (CONSTS.score2 == 5) {
                        gameEnd(intervalID);  
                    } else {
                        roll();
                    }   
                }
            }   
            if (CSS.ball.left >= CSS.arena.width - CSS.stick.width - CSS.ball.width) {
                if (CSS.ball.top > CSS.stick2.top && CSS.ball.top < CSS.stick2.top + CSS.stick.height) {
                    CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1;
                } else {
                    CONSTS.score1++;
                    if (CONSTS.score1 == 5) {
                        gameEnd(intervalID);
                    } else {
                        roll();
                    }       
                }
            }
            
            // Updating scores
            $('#score-1')[0].innerHTML = CONSTS.score1;
            $('#score-2')[0].innerHTML = CONSTS.score2;
            

        }, CONSTS.gameSpeed);
    }

    function roll() {
        CSS.ball.top = 300;
        CSS.ball.left = 450;

        var side = -1;

        if (Math.random() < 0.5) {
            side = 1;
        }

        CONSTS.ballTopSpeed = Math.random() * -2 - 3;
        CONSTS.ballLeftSpeed = side * (Math.random() * 2 + 3);
    }
    
    function disappear() {
        $('#pong-ball').css({"display": "none"});
    }

    function result() {
        if (CONSTS.score1 == 5) {
            $('#pong-result')[0].innerHTML = "Left Player Wins";
        }
        if (CONSTS.score2 == 5) {
            $('#pong-result')[0].innerHTML = "Right Player Wins";
        }
    }

    function gameEnd(intervalID) {
        result();
        disappear();
        localStorage.clear();
        clearInterval(intervalID);
    }

    function saveScore() {
        localStorage.setItem("score1", JSON.stringify(CONSTS.score1));
        localStorage.setItem("score2", JSON.stringify(CONSTS.score2));    
    }

    function loadScore() {
        CONSTS.score1 = JSON.parse(localStorage.getItem('score1'));
        CONSTS.score2 = JSON.parse(localStorage.getItem('score2'));
    }

    start();
})();