import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root', 
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(): boolean {
    const isBrowser = isPlatformBrowser(this.platformId);
    if (!isBrowser) {
      // Allow navigation during SSR/prerendering to avoid localStorage references
      return true;
    }

    const isLoggedIn = !!localStorage.getItem('user'); 
    if (!isLoggedIn) {
      this.router.navigate(['/login']); 
      return false;
    }
    return true; 
  }
}
