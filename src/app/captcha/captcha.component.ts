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
  }

  maybeNext() {
  if (this.currentState < 3) {
    this.stateService.updateCurrentState(this.currentState + 1);
  } else {
    // All challenges complete, navigate!
    this.router.navigate(['/result']);
  }
}

  handleCaptchaResult(isCorrect: boolean): void {
    if (isCorrect) {
      if (this.currentState < 3) {
        this.currentState++;
        this.stateService.updateCurrentState(this.currentState);
        this.stateService.updateHighestStateReached(this.highestStateReached);
      } else {
        this.stateService.updateCurrentState(3);
        this.stateService.updateHighestStateReached(3);
        this.router.navigate(['/result']);
      }
      // Reset word-image attempts ONLY if user solved it
      if (this.currentState === 2) {
        this.stateService.updateWordImageCaptchaTries(0);
      }
    } else {
      // Only challenge 2 has the 3 tries logic:
      if (this.currentState === 2) {
        const tries = this.stateService.loadState('wordImageCaptchaTries', 0) + 1;
        this.stateService.updateWordImageCaptchaTries(tries);
        if (tries >= 3) {
          this.stateService.resetState();
          // Optional: this.router.navigate(['/wrong']);
        }
        // Otherwise, user can keep retrying challenge 2!
      }
      // Challenges 1 and 3 have unlimited retries—just let user retry on failure
    }
  }

}
