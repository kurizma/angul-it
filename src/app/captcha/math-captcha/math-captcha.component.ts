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
  wrongAnswer = false;

  @Output() result = new EventEmitter<boolean>();
  @Output() validChange = new EventEmitter<boolean>();

  constructor() {
    this.firstNumber = this.randomNumber();
    this.secondNumber = this.randomNumber();
  }

  isInputValid(): boolean {
    return this.userAnswer.trim().length > 0 && !isNaN(Number(this.userAnswer));
  }

  onInputChange() {
    this.validChange.emit(this.isInputValid());
    this.wrongAnswer = false; 
  }

  verifyMathCaptcha() {
    const isCorrect = Number(this.userAnswer) === this.firstNumber + this.secondNumber;
    this.wrongAnswer = !isCorrect;
    this.result.emit(isCorrect);
  }

  private randomNumber(): number {
    return Math.floor(Math.random() * 20);
  }
}
