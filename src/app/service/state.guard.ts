import { CanActivateFn, Router } from '@angular/router';
import { StateService } from '../service/state.service';
import { inject } from '@angular/core'; 

export const stateGuard: CanActivateFn = (route, state) => {
  const stateService = inject(StateService);
  const router = inject(Router);

  // This assumes you want to check 'highestStateReached' and allow if ≥ 3
  const highestReached = stateService.loadState('highestStateReached', 1);
  if (highestReached < 3) {
    router.navigate(['']);
    return false;
  }
  return true;
};
