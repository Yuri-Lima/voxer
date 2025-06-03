import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Check if user has a token
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Check current user from observable
    return this.authService.currentUser$.pipe(
      take(1),
      map(currentUser => {
        if (currentUser && this.authService.isAdmin()) {
          return true;
        } else {
          // Try to load current user if not loaded yet
          this.authService.getCurrentUser().subscribe({
            next: (user) => {
              if (!user || !this.authService.isAdmin()) {
                this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
              }
            },
            error: (error) => {
              console.error('Auth guard error:', error);
              this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            }
          });
          return false;
        }
      }),
      catchError(error => {
        console.error('Auth guard error:', error);
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return of(false);
      })
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    return this.authService.currentUser$.pipe(
      take(1),
      map(currentUser => {
        if (currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN')) {
          return true;
        }

        // Redirect to unauthorized page or login
        this.router.navigate(['/unauthorized']);
        return false;
      })
    );
  }
}

