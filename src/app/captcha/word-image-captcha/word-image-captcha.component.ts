import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input, ViewChild } from '@angular/core';
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
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  // @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  captcha: (string | number)[] = new Array(6);
  theCaptcha: string = '';
  userInput: string = '';
  captchaError: string = '';
  tries: number = 0;
  @Output() result = new EventEmitter<boolean>();
  @Input() isCompleted: boolean = false;

  isInputValid(): boolean {
    return this.userInput.trim().length > 0;
  }
  onInputChange() {
    this.captchaError = '';
  }

  private wordImageCaptchaTriesSubscription?: Subscription;;

  constructor(private stateService: StateService) {
    // this.createCaptcha();
    // console.log('Generated CAPTCHA:', this.theCaptcha);
  }

  ngOnInit(): void {
    this.wordImageCaptchaTriesSubscription = this.stateService.wordImageCaptchaTries$.subscribe(state => {
      this.tries = state;
    });
  }

  // ngAfterViewInit() is called after the component's view has been fully initialized
  ngAfterViewInit() {
    setTimeout(() => {
      if (!this.isCompleted && this.canvas && this.canvas.nativeElement) {
        this.createCaptcha();  // Generate new CAPTCHA now that view is ready
        console.log('Generated CAPTCHA:', this.theCaptcha);
        this.drawCaptcha();    // Draw it immediately
        // this.drawCaptcha();
      }
    }, 0);
  }

  ngOnDestroy(): void {
    this.wordImageCaptchaTriesSubscription?.unsubscribe();
  }

  ngOnChanges() {
  if (!this.isCompleted && this.canvas && this.canvas.nativeElement) {
      this.createCaptcha();
      this.drawCaptcha();
    }
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
    const canvasEl = this.canvas?.nativeElement;
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    // Draw random lines
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.moveTo(canvasEl.width * Math.random(), canvasEl.height * Math.random());
      ctx.lineTo(canvasEl.width * Math.random(), canvasEl.height * Math.random());
      ctx.strokeStyle = `rgb(${Math.round(256 * Math.random())},${Math.round(256 * Math.random())},${Math.round(256 * Math.random())})`;
      ctx.stroke();
    }

    const textColors = ["rgb(0,0,0)", "rgb(130,130,130)"];
    const letterSpace = canvasEl.width / this.theCaptcha.length;
    for (let i = 0; i < this.theCaptcha.length; i++) {
      const xInitialSpace = 20;
      ctx.font = "20px monospace";
      ctx.fillStyle = textColors[this.randomNumber(0, 1)];
      ctx.fillText(
        this.theCaptcha[i], 
        xInitialSpace + i * letterSpace, 
        this.randomNumber(40, 60) // y position within canvas height
      );
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