import { Component } from '@angular/core';
import { StateService } from '../service/state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {
  wordImageCaptchaTries: number;
  timerSeconds: number;
  formattedTimer: string;

  constructor(private stateService: StateService, private router: Router) {
    this.wordImageCaptchaTries = this.stateService.loadState('wordImageCaptchaTries', 0);
    console.log('Start:', localStorage.getItem('startTime'));
    console.log('End:', localStorage.getItem('endTime'));
    this.timerSeconds = this.stateService.getElapsedTimeSeconds();
    this.formattedTimer = this.formatTimer(this.timerSeconds);
  }

  restart() {
    this.stateService.resetState();
    this.router.navigate(['']);

  }
    formatTimer(totalSec: number): string {
    const minutes = Math.floor(totalSec / 60);
    const seconds = Math.round(totalSec % 60);
    return `${minutes}m ${seconds}s`;
  }
}
