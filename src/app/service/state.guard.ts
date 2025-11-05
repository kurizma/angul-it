import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StateService } from '../service/state.service';

@Injectable({
  providedIn: 'root'
})
export class StateGuard implements CanActivate {
  constructor(private stateService: StateService, private router: Router) {}

  canActivate(): boolean {
    const highestReached = this.stateService.loadState('highestStateReached', 1);
    if (highestReached < 3) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
