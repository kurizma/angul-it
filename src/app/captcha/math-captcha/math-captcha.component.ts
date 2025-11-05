import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-math-captcha',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './math-captcha.component.html',
  styleUrl: './math-captcha.component.css'
})
export class MathCaptchaComponent {
  firstNumber: number;
  secondNumber: number;
  userAnswer = '';
  @Output() result = new EventEmitter<boolean>();

  constructor() {
    this.firstNumber = this.randomNumber();
    this.secondNumber = this.randomNumber();
  }

  verifyMathCaptcha() {
    const isCorrect = Number(this.userAnswer) === this.firstNumber + this.secondNumber;
    this.result.emit(isCorrect);
  }

  private randomNumber(): number {
    return Math.floor(Math.random() * 20);
  }
}
