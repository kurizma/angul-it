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

  constructor(private stateService: StateService, private router: Router) {
    this.wordImageCaptchaTries = this.stateService.loadState('wordImageCaptchaTries', 0);
  }

  restart() {
    this.stateService.resetState();
    this.router.navigate(['']);
  }
}
