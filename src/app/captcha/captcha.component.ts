import { Component, OnInit, OnDestroy  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StateService } from '../service/state.service';
import { MathCaptchaComponent } from './math-captcha/math-captcha.component';
import { WordImageCaptchaComponent } from './word-image-captcha/word-image-captcha.component';
import { ImageGridCaptchaComponent } from './image-grid-captcha/image-grid-captcha.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [
    CommonModule,
    MathCaptchaComponent, WordImageCaptchaComponent, ImageGridCaptchaComponent
  ],
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.css'
})
export class CaptchaComponent implements OnInit, OnDestroy {

  currentState: number = 1;
  highestStateReached: number = 1;
  isCurrentValid = false;

  private currentStateSubscription?: Subscription;
  private highestStateReachedSubscription?: Subscription;

  challengeTitles = [
    '',                                 // Placeholder for index 0
    'Find the sum!',                    // State 1
    'Match the code in the image!',        // State 2
    'Select all images with cats!'      // State 3
  ];

  failureCounts: { [key: string]: number } = {
    "1": 0,
    "2": 0,
    "3": 0
  };
  MAX_FAILURES = 3;
  showTryAgainModal = false;

  constructor(public stateService: StateService,private router: Router) {}

  ngOnInit(): void {
    this.currentStateSubscription = this.stateService.currentState$.subscribe(state => {
      this.currentState = state;
    });
    this.highestStateReachedSubscription = this.stateService.highestStateReached$.subscribe(reach => {
      this.highestStateReached = reach;
    });
  }

  ngOnDestroy(): void {
    this.currentStateSubscription?.unsubscribe();
    this.highestStateReachedSubscription?.unsubscribe();
    document.body.style.overflow = '';
  }

  handleCaptchaResult(isCorrect: boolean): void {
    if (isCorrect) {
      // Reset this challenge's failure counter
      this.failureCounts[this.currentState] = 0;
      if (this.currentState < 3) {
        this.currentState++;
        this.stateService.updateCurrentState(this.currentState);
        this.stateService.updateHighestStateReached(this.highestStateReached);
      } else {
        this.stateService.updateCurrentState(3);
        this.stateService.updateHighestStateReached(3);
        this.router.navigate(['/result']);
      }
      if (this.currentState === 2) {
        this.stateService.updateWordImageCaptchaTries(0);
      }
    } else {
      // Increment failure for this challenge
      this.failureCounts[this.currentState]++;
      if (this.failureCounts[String(this.currentState)] >= this.MAX_FAILURES) {
        this.showTryAgainModal = true;
        document.body.style.overflow = 'hidden';
        return; // Blocks further action until modal is closed/retried
      }
      if (this.currentState === 2) {
        const tries = this.stateService.loadState('wordImageCaptchaTries', 0) + 1;
        this.stateService.updateWordImageCaptchaTries(tries);
      }
    }
  }

  restartCaptcha() {
    this.stateService.resetState();
    this.currentState = 1;
    this.highestStateReached = 1;
    this.failureCounts = { "1": 0, "2": 0, "3": 0 };
    this.showTryAgainModal = false;
    document.body.style.overflow = '';
    this.router.navigate(['/']); // Redirect to start/home page
  }
  
  closeModal(): void {
    this.showTryAgainModal = false;
    document.body.style.overflow = ''; // Enable scroll
  }

}
