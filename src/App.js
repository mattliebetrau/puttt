import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mousePosition : {},
      xSpeed : 0,
      ySpeed : 0,
      score  : 0,
      shotFinished : false
    }

    this.getMousePos = this.getMousePos.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMousedown = this.handleMousedown.bind(this);
    this.handleMouseup = this.handleMouseup.bind(this);
    this.shotMadeCheck = this.shotMadeCheck.bind(this);
    this.drawBall = this.drawBall.bind(this);
    this.drawGuide = this.drawGuide.bind(this);
    this.drawHole = this.drawHole.bind(this);
    this.draw = this.draw.bind(this);

    document.addEventListener('mousemove', this.handleMouseMove, false);
    document.addEventListener('mousedown', this.handleMousedown, false);
    document.addEventListener('mouseup', this.handleMouseup, false);
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    this.ballX = this.canvas.width / 2;
    this.ballY = this.canvas.height - 50;
    this.holeSize = 20;
    this.holeX = (this.canvas.width / 2) - (this.holeSize / 2);
    this.holeY = 50;
    this.gravity = 0.05;
    this.ballRadius = 10;
    this.isBallMoving = false;
    this.shotMade = false;
    this.xPower = 0;
    this.yPower = 0;
    this.isMouseDown = false;
    this.velocity = 0.98;
    this.guideDrawback = 40;
    this.shotMadeSound = new Audio('./shot_made.wav');
    this.shotMadeSoundPlayed = false;

    this.draw();
  }

  getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  handleMouseMove(e){
    this.setState({
      mousePosition : this.getMousePos(this.canvas, e)
    });
  }

  handleMousedown(e) {
    this.isMouseDown = true;
  }

  handleMouseup(e) {
    this.isMouseDown = false;
    this.isBallMoving = true;
  }

  shotMadeCheck() {
    var ballYIn = ((this.ballY - (this.holeSize / 2)) - this.holeY) < 10 && ((this.ballY - (this.holeSize / 2)) - this.holeY) > 0,
        ballXIn = ((this.ballX - (this.holeSize / 2)) - this.holeX) < 10 && ((this.ballX - (this.holeSize / 2)) - this.holeX) >= 0,
        tooFast = this.state.ySpeed < -10;

    if (ballYIn && ballXIn && !tooFast) {
      this.shotMade = true;
    }
  }

  drawBall() {
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI*2);
    this.ctx.fillStyle = '#2980b9';
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawGuide() {
    this.ctx.beginPath();
    this.ctx.rect(this.holeX, this.canvas.height - this.guideDrawback, this.holeSize, this.holeSize / 2);
    this.ctx.fillStyle = '#2980b9';
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawHole() {
    this.ctx.beginPath();
    this.ctx.rect(this.holeX, this.holeY, this.holeSize, this.holeSize);
    this.ctx.fillStyle = '#2980b9';
    this.ctx.fill();
    this.ctx.closePath();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawHole();

    if (!this.shotMade) {
      this.drawBall();
    } else {
      if (!this.shotMadeSoundPlayed) {
        // this.shotMadeSound.play();
        // this.shotMadeSoundPlayed = true;
      }
    }

    this.drawGuide();

    this.shotMadeCheck();

    if (this.isMouseDown && !this.isBallMoving) {
      this.setState({
        xSpeed : -(this.state.mousePosition.x - this.ballX) / 10,
        ySpeed : -(this.state.mousePosition.y - this.ballY) / 10
      });
      this.guideDrawback -= 0.1;
    } else {
      this.guideDrawback = 40;
    }

    if (this.isBallMoving) {
      if ((this.state.ySpeed > -0.1 && this.state.ySpeed < 0.1) && (this.state.ySpeed > -0.1 && this.state.ySpeed < 0.1)) {
        this.setState({
          xSpeed : 0,
          ySpeed : 0,
          shotFinished : true
        });
        this.isBallMoving = false;
      }
    }

    if (this.state.shotFinished) {
      this.setState({
        score : this.state.score + 1,
        shotFinished : false
      });
    }

    if (this.ballX + this.state.xSpeed > this.canvas.width - this.ballRadius || this.ballX + this.state.xSpeed < this.ballRadius) {
      this.setState({
        xSpeed : -this.state.xSpeed
      });
    }
    if (this.ballY + this.state.ySpeed > this.canvas.height - this.ballRadius || this.ballY + this.state.ySpeed < this.ballRadius) {
      this.setState({
        ySpeed : -this.state.ySpeed
      });
      // velocity *= -1;
    }

    if (this.isBallMoving) {
      this.setState({
        xSpeed : this.state.xSpeed * this.velocity,
        ySpeed : this.state.ySpeed * this.velocity
      });

      this.ballX += this.state.xSpeed;
      this.ballY += this.state.ySpeed;
    }

    requestAnimationFrame(this.draw);
  }

  render() {
    return (
      <div className="App">
        <canvas width="320" height="568" ref={(c) => { this.canvas = c; }}></canvas>
        <div>{`x speed: ${this.state.xSpeed}`}</div>
        <div>{`y speed: ${this.state.ySpeed}`}</div>
        <div>{`Score: ${this.state.score}`}</div>
      </div>
    );
  }
}

export default App;
