import { TestBed } from '@angular/core/testing';
import { challengeGuard, resultGuard } from './state.guard';
import { Router } from '@angular/router';
import { StateService } from '../service/state.service';

class MockStateService {
  highestStateReached = 1;
  loadState(key: string, defaultValue: any) {
    if (key === 'highestStateReached') return this.highestStateReached;
    return defaultValue;
  }
}

describe('challengeGuard', () => {
  let mockState: MockStateService;
  let mockRouter: { navigate: jasmine.Spy };

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      challengeGuard({} as any, {} as any)
    );

  beforeEach(() => {
    mockState = new MockStateService();
    mockRouter = { navigate: jasmine.createSpy('navigate') };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: StateService, useValue: mockState },
      ],
    });
  });

  it('allows access if not finished', () => {
    mockState.highestStateReached = 2;
    expect(runGuard()).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('redirects if finished', () => {
    mockState.highestStateReached = 3;
    expect(runGuard()).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });
});

describe('resultGuard', () => {
  let mockState: MockStateService;
  let mockRouter: { navigate: jasmine.Spy };

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      resultGuard({} as any, {} as any)
    );

  beforeEach(() => {
    mockState = new MockStateService();
    mockRouter = { navigate: jasmine.createSpy('navigate') };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: StateService, useValue: mockState },
      ],
    });
  });

  it('redirects if not finished', () => {
    mockState.highestStateReached = 2;
    expect(runGuard()).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('allows access if finished', () => {
    mockState.highestStateReached = 3;
    expect(runGuard()).toBeTrue();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
