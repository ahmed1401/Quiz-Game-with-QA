import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
    
  }
  

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}