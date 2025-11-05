import { Component } from '@angular/core';
import { MathCaptchaComponent } from './math-captcha/math-captcha.component';
import { WordImageCaptchaComponent } from './word-image-captcha/word-image-captcha.component';
import { ImageGridCaptchaComponent } from './image-grid-captcha/image-grid-captcha.component';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [MathCaptchaComponent, WordImageCaptchaComponent, ImageGridCaptchaComponent],
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.css'
})
export class CaptchaComponent {

}
