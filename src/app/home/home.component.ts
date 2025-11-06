import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../service/state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router, private stateService: StateService) {}


  startCaptcha() {
    this.stateService.resetState();
    this.stateService.setStartTime();
    this.router.navigate(['/captcha']);
  }
}
