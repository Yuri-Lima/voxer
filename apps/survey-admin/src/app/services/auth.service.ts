import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private apollo: Apollo) {
    // Check for existing token on service initialization
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.tokenSubject.next(token);
      this.loadCurrentUser();
    }
  }

  login(input: LoginInput): Observable<AuthResponse> {
    return this.apollo.mutate<{ login: AuthResponse }>({
      mutation: gql`
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            accessToken
            refreshToken
            user {
              id
              email
              name
              role
              isActive
              createdAt
            }
          }
        }
      `,
      variables: { input },
    }).pipe(
      map(result => result.data!.login),
      tap(response => {
        this.setTokens(response.accessToken, response.refreshToken);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(input: RegisterInput): Observable<AuthResponse> {
    return this.apollo.mutate<{ register: AuthResponse }>({
      mutation: gql`
        mutation Register($input: RegisterInput!) {
          register(input: $input) {
            accessToken
            refreshToken
            user {
              id
              email
              name
              role
              isActive
              createdAt
            }
          }
        }
      `,
      variables: { input },
    }).pipe(
      map(result => result.data!.register),
      tap(response => {
        this.setTokens(response.accessToken, response.refreshToken);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.apollo.mutate<{ refreshToken: AuthResponse }>({
      mutation: gql`
        mutation RefreshToken($refreshToken: String!) {
          refreshToken(refreshToken: $refreshToken) {
            accessToken
            refreshToken
            user {
              id
              email
              name
              role
              isActive
              createdAt
            }
          }
        }
      `,
      variables: { refreshToken },
    }).pipe(
      map(result => result.data!.refreshToken),
      tap(response => {
        this.setTokens(response.accessToken, response.refreshToken);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): Observable<boolean> {
    return this.apollo.mutate<{ logout: boolean }>({
      mutation: gql`
        mutation Logout {
          logout
        }
      `,
    }).pipe(
      map(result => result.data!.logout),
      tap(() => {
        this.clearTokens();
        this.currentUserSubject.next(null);
      })
    );
  }

  getCurrentUser(): Observable<User> {
    return this.apollo.query<{ me: User }>({
      query: gql`
        query Me {
          me {
            id
            email
            name
            role
            isActive
            createdAt
          }
        }
      `,
    }).pipe(
      map(result => result.data.me),
      tap(user => this.currentUserSubject.next(user))
    );
  }

  private loadCurrentUser() {
    this.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
      },
      error: (error) => {
        console.error('Failed to load current user:', error);
        this.clearTokens();
      }
    });
  }

  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.tokenSubject.next(accessToken);
  }

  private clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.tokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.role === role : false;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN') || this.hasRole('SUPER_ADMIN');
  }
}

