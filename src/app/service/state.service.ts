import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; // find out what this is

@Injectable({
  providedIn: 'root'
})
export class StateService implements OnDestroy {
  private currentStateSubject = new BehaviorSubject<number>(this.loadState('currentState', 1));
  private highestStateReachedSubject = new BehaviorSubject<number>(this.loadState('highestStateReached', 1));
  private wordImageCaptchaTriesSubject = new BehaviorSubject<number>(this.loadState('wordImageCaptchaTries',0));

  currentState$ = this.currentStateSubject.asObservable();
  highestStateReached$ = this.highestStateReachedSubject.asObservable();
  wordImageCaptchaTries$ = this.wordImageCaptchaTriesSubject.asObservable();

  constructor() {
    // Subscribe to state changes and save them
    this.currentStateSubject.subscribe(state => {
      this.saveState('currentState', state);
    });
    this.highestStateReachedSubject.subscribe(state => {
      this.saveState('highestStateReached', state);
    });
    this.wordImageCaptchaTriesSubject.subscribe(state => {
      this.saveState('wordImageCaptchaTries', state);
    });
  }

  ngOnDestroy(): void {
    // Save state when the service is destroyed
    this.saveState('currentState', this.currentStateSubject.value);
    this.saveState('highestStateReached', this.highestStateReachedSubject.value);
    this.saveState('wordImageCaptchaTries', this.wordImageCaptchaTriesSubject.value);
  }

  public loadState(key: string, defaultValue: number): number {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? parseInt(value, 10) : defaultValue;
    } catch (error) {
      console.error(`Error loading state for key ${key}:`, error);
      return defaultValue;
    }
  }

  // Save the state to local storage
  private saveState(key: string, value: number): void {
    localStorage.setItem(key, value.toString());
  }

  // Update the highest state reached
  updateHighestStateReached(state: number): void {
    this.highestStateReachedSubject.next(state);
  }

  // Update the current state
  updateCurrentState(state: number): void {
    this.currentStateSubject.next(state);
  }


  updateWordImageCaptchaTries(state: number): void {
    this.wordImageCaptchaTriesSubject.next(state);
  }


  // Reset the state to the initial state
  resetState(): void {
    this.updateCurrentState(1);
    this.updateHighestStateReached(1);
    this.updateWordImageCaptchaTries(0);
  }
}