import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    navigateSpy = jasmine.createSpy('navigate');

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {
          provide: Router,
          useValue: { navigate: navigateSpy },
        },
      ],
    });

    localStorage.clear();
    guard = TestBed.inject(AuthGuard);
  });

  it('allows navigation when a user exists in localStorage', () => {
    localStorage.setItem('user', JSON.stringify({ id: 'abc' }));

    const canActivate = guard.canActivate();

    expect(canActivate).toBeTrue();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('redirects to login when not authenticated', () => {
    const canActivate = guard.canActivate();

    expect(canActivate).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});