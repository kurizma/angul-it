import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-word-image-captcha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './word-image-captcha.component.html',
  styleUrls: ['./word-image-captcha.component.css']
})
export class WordImageCaptchaComponent {
  userInput: string = '';
  tries: number = 0;
  captchaError: string = '';
  captcha: string = 'X7C9B'; // Example: replace with randomization if needed

  verifyWordImageCaptcha() {
    if (this.userInput === this.captcha) {
      this.captchaError = '';
      // continue to next step or emit event as needed
    } else {
      this.tries++;
      this.captchaError = 'Incorrect, try again.';
    }
  }
}
