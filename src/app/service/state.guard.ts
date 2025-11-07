import { CanActivateFn, Router } from '@angular/router';
import { StateService } from '../service/state.service';
import { inject } from '@angular/core';

// Challenge Guard: Only allow access if NOT finished
export const challengeGuard: CanActivateFn = (route, state) => {
  const stateService = inject(StateService);
  const router = inject(Router);
  if (stateService.loadState('highestStateReached', 1) >= 3) {
    router.navigate(['']);
    return false;
  }
  return true;
};

// Result Guard: Only allow access if FINISHED
export const resultGuard: CanActivateFn = (route, state) => {
  const stateService = inject(StateService);
  const router = inject(Router);
  if (stateService.loadState('highestStateReached', 1) < 3) {
    router.navigate(['']);
    return false;
  }
  return true;
};
