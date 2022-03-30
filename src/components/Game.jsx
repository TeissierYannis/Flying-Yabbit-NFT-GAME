import React, {Component} from 'react';
import background from '../textures/background-day.png';
import pipebottop from '../textures/pipe-green-bottop.png';
import pipetopbot from '../textures/pipe-green-topbot.png';
import birdTextureDefault from '../textures/bird.png';

import '../style/Game.css'

class Game extends Component {

    game = {
        width: 450,
        height: 650
    }

    birdTexture = birdTextureDefault;

    constructor(props) {
        super(props);
        // bird URI
        this.birdTexture = props.nft.uri;

        this.canvas = React.createRef();
        this.state = {
            bird: {
                x: 50,
                y: 50,
                width: 50,
                height: 50,
                speed: 0,
                gravity: 0.5,
                jump: -10
            },
            pipes: [],
            score: 0,
            isBackgroundLoaded: false,
        }
    }

    drawBird = () => {
        const birdImg = new Image()
        birdImg.src = this.birdTexture;
        // draw bird with perfect size
        this.ctx.drawImage(birdImg, this.state.bird.x, this.state.bird.y, this.state.bird.width, this.state.bird.height);
    }

    drawPipes = () => {
        // set texture for pipes (use image)
        let img = new Image();
        img.src = pipebottop;

        let reverseImg = new Image();
        reverseImg.src = pipetopbot;
        // reverse pipe
        this.state.pipes.forEach(pipe => {
            // if pipe is from top to bottom use reverse image
            if (!pipe.fromTopToBottom) {
                this.ctx.drawImage(reverseImg, pipe.x, pipe.y, pipe.width, pipe.height);
            } else {
                this.ctx.drawImage(img, pipe.x, pipe.y, pipe.width, pipe.height);
            }
        });

    }

    drawScore = () => {
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '20px Verdana';
        this.ctx.fillText(`Score: ${this.state.score}`, 10, 30);
    }

    addPipe = () => {
        // create tunnel with pipe and gap
        let gap = Math.floor(Math.random() * this.game.height / 2) + 50;
        let pipe = {
            x: this.game.width,
            y: 0,
            width: 50,
            height: gap,
            speed: 2,
            passed: false,
            fromTopToBottom: false
        }
        // create second pipe at the opposite side
        let pipe2 = {
            x: this.game.width,
            y: gap + this.game.height / 2,
            width: 50,
            height: this.game.height + 100 - gap - this.game.height / 5,
            speed: 2,
            passed: false,
            fromTopToBottom: true
        }

        this.setState({
            pipes: [...this.state.pipes, pipe]
        });
        this.setState({
            pipes: [...this.state.pipes, pipe2]
        });
    }

    gameOver = () => {
        this.setState({
            pipes: []
        });

        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = '50px Arial';
        this.ctx.fillText('Game Over', this.game.width / 2 - 130, this.game.height / 2);

        this.ctx.fillStyle = '#000';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Press R to Restart', this.game.width / 2 - 80, this.game.height / 2 + 50);

        clearInterval(this.interval);
        clearInterval(this.pipeInterval);

        // remove event listener on spacebar
        window.removeEventListener('keydown', this.jump);

        // stop the game
        this.setState({
            bird: {
                x: 50,
                y: 50,
                width: 50,
                height: 50,
                speed: 0,
                gravity: 0,
                jump: -10
            },
            pipes: [],
            score: 0
        });

        // listener for restart
        document.addEventListener('keydown', this.restartEvent)
    }

    restartEvent = (e) => {
        if (e.keyCode === 82) {
            this.startGame();
        }
    }

    startGame = () => {
        document.removeEventListener('keydown', this.restartEvent);
        // patch event listener on spacebar
        window.addEventListener('keydown', this.jump);
        this.ctx = this.canvas.current.getContext('2d');
        this.ctx.canvas.width = this.game.width;
        this.ctx.canvas.height = this.game.height;
        this.interval = setInterval(this.update, 1000 / 60);
        this.pipeInterval = setInterval(this.addPipe, 1500);

        // reset state
        this.setState(
            {
                bird: {
                    x: 50,
                    y: 50,
                    width: 50,
                    height: 50,
                    speed: 0,
                    gravity: 0.5,
                    jump: -10
                },
                pipes: [],
                score: 0
            }
        )

        // add event listeners for keyboard on space bar
        document.addEventListener('keydown', this.jump);
    }

    componentDidMount() {
        this.startGame();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        clearInterval(this.pipeInterval);
        document.removeEventListener('keydown', this.jump);
    }

    update = () => {

        this.ctx.clearRect(0, 0, this.game.width, this.game.height);
        this.draw();

        // update bird state with setState
        this.setState({
            bird: {
                ...this.state.bird,
                y: this.state.bird.y + this.state.bird.speed,
                speed: this.state.bird.speed + this.state.bird.gravity
            }
        });

        // update pipes
        this.state.pipes.forEach(pipe => {
            pipe.x -= 2;
            this.drawPipes(pipe);
        });

        // patch bird hitbox
        let hitbox = {
            x: this.state.bird.x - this.state.bird.width / 2,
            y: this.state.bird.y - this.state.bird.height / 2,
            width: this.state.bird.width - 5,
            height: this.state.bird.height - 5
        };

        // check for collision with pipes
        this.state.pipes.forEach(pipe => {
            let hitbox2 = {
                x: pipe.x,
                y: pipe.y,
                width: pipe.width - 20,
                height: pipe.height - 20
            };

            if (this.checkCollision(hitbox, hitbox2)) {
                this.gameOver();
            }
        });
        // check for collision with the ground
        if (this.state.bird.y + this.state.bird.height - 30 >= this.game.height) {
            this.gameOver();
        }
        // check for collision with the ceiling
        if (this.state.bird.y <= 0) {
            this.gameOver();
        }

        // check for pipes that passed
        this.state.pipes.forEach(pipe => {
            if (pipe.x + pipe.width < 0) {
                pipe.passed = true;
                if (pipe.passed) {
                    this.setState({
                        score: this.state.score + 0.5
                    });
                    // remove pipe
                    this.state.pipes.splice(this.state.pipes.indexOf(pipe), 1);
                }
            }
        });

        this.drawScore()
    }

    checkCollision = (a, b) => {
        return (a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y);
    }

    jump = (e) => {
        if (e.keyCode === 32) {
            this.setState({
                bird: {
                    ...this.state.bird,
                    speed: this.state.bird.jump
                }
            });
        }
    }

    draw = async () => {
        // if background already loaded
        this.drawBackground()
        this.drawBird();
        this.drawPipes();
    }

    drawBackground = () => {
        // set background state to true
        this.setState({
            background: true
        });
        // react import img
        let img = new Image();
        img.src = background;
        this.ctx.drawImage(img, 0, 0, this.game.width, this.game.height);
    }

    drawFloor = () => {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, this.game.height - 10, this.game.width, 10);
    }

    render() {
        return (
            <div className="game-container">
                <canvas ref={this.canvas} width={this.game.width} height={this.game.height}/>
            </div>
        );
    }
}

export default Game;