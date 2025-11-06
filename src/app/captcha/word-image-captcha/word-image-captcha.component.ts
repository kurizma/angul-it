import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StateService } from '../../service/state.service';



@Component({
  selector: 'app-word-image-captcha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './word-image-captcha.component.html',
  styleUrl: './word-image-captcha.component.css'
})
export class WordImageCaptchaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  captcha: (string | number)[] = new Array(6);
  theCaptcha: string = '';
  userInput: string = '';
  captchaError: string = '';
  tries: number = 0;
  @Output() result = new EventEmitter<boolean>();

  isInputValid(): boolean {
    return this.userInput.trim().length > 0;
  }
  onInputChange() {
    this.captchaError = '';
  }

  private wordImageCaptchaTriesSubscription?: Subscription;;

  constructor(private stateService: StateService) {
    this.createCaptcha();
  }

  ngOnInit(): void {
    this.wordImageCaptchaTriesSubscription = this.stateService.wordImageCaptchaTries$.subscribe(state => {
      this.tries = state;
    });
  }

  // ngAfterViewInit() is called after the component's view has been fully initialized
  ngAfterViewInit() {
    this.drawCaptcha();
  }

  ngOnDestroy(): void {
    this.wordImageCaptchaTriesSubscription?.unsubscribe();
  }

  createCaptcha() {
    for (let q = 0; q < 6; q++) {
      if (q % 2 === 0) {
        this.captcha[q] = String.fromCharCode(Math.floor(Math.random() * 26 + 65));
      } else {
        this.captcha[q] = (Math.floor(Math.random() * 10)).toString();
      }
    }
    this.theCaptcha = this.captcha.join("");
  }

  // generate a random number between min and max
  randomNumber = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min);
  
  
  // turn the captcha into an image
  drawCaptcha() {
    // get the canvas element
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (ctx) {
      // clear the canvas before drawing
      ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      // draw random lines
      for (var i= 0; i<7; i++) {
        // beginPath() starts a new path by emptying the list of sub-paths. Call this method when you want to create a new path.
        ctx.beginPath();
        // moveto(x,y) draws a line from the current drawing position to the position specified by x and y.
        ctx.moveTo(this.canvas.nativeElement.width*Math.random(),this.canvas.nativeElement.height*Math.random());
        // lineto(x,y) draws a line from the current drawing position to the position specified by x and y.
        ctx.lineTo(this.canvas.nativeElement.width*Math.random(),this.canvas.nativeElement.height*Math.random());
        // strokeStyle sets or returns the color, gradient, or pattern used for strokes.
        ctx.strokeStyle= "rgb(" +
        Math.round(256*Math.random()) + "," +
        Math.round(256*Math.random()) + "," +
        Math.round(256*Math.random()) + ")";
        ctx.stroke();
      }
      const textColors = ["rgb(0,0,0)", "rgb(130,130,130)"];
      //space between letters
      const letterSpace = 140 / this.theCaptcha.length;
      for (let i = 0; i < this.theCaptcha.length; i++) {
        // Define initial space on X axis
        const xInitialSpace = 20;
        //Set font for canvas element
        ctx.font = "20px Roboto Mono";
        //set text color
        ctx.fillStyle = textColors[this.randomNumber(0, 1)];
        ctx.fillText(
          this.theCaptcha[i],
          xInitialSpace + i * letterSpace,
          this.randomNumber(23, 40),
          100);
      }
    }
  }
  
  // verify the user's input, user has 3 tries
  verifyWordImageCaptcha() {
    if (!this.isInputValid()) {
      this.captchaError = "Please type what you see.";
      return;
    }
    if (this.userInput === "") {
      this.tries++;
      this.stateService.updateWordImageCaptchaTries(this.tries);
      this.captchaError = "Captcha must be filled";
      if (this.tries > 2) {
        this.result.emit(false);
      }
      return;
    }
    const isCaptchaValid = this.userInput === this.theCaptcha;
    if (!isCaptchaValid) {
      this.tries++;
      this.stateService.updateWordImageCaptchaTries(this.tries);
      if (this.tries === 1) {
        this.captchaError = "Wrong captcha! Try again.";
      } else if (this.tries === 2) {
        this.captchaError = "Wrong captcha! Last try!";
      }
      // Emit false every time there is a wrong answer
      this.result.emit(false);
    } else {
      this.result.emit(true);
    }
  }
}