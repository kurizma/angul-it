import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Output, EventEmitter} from '@angular/core';


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

  @Output() result = new EventEmitter<boolean>();
  @Output() validChange = new EventEmitter<boolean>();

  isInputValid(): boolean {
    return this.userInput.trim().length > 0;
  }

  onInputChange() {
    this.validChange.emit(this.isInputValid());
  }

  verifyWordImageCaptcha() {
    if (this.userInput === this.captcha) {
      this.captchaError = '';
      this.result.emit(true);
    } else {
      this.tries++;
      this.captchaError = 'Incorrect, try again.';
      this.result.emit(false);
    }
  }
}
