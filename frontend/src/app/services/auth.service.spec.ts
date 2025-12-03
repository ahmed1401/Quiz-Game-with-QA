import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('issues a POST request to login', () => {
    const payload = { email: 'user@example.com', password: 'Secret!123' };
    const responseBody = { message: 'Login successful' };

    service.login(payload.email, payload.password).subscribe((response) => {
      expect(response).toEqual(responseBody);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/users/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(responseBody);
  });

  it('issues a POST request to register', () => {
    const payload = { username: 'New User', email: 'new@example.com', password: 'Secret!123' };
    const responseBody = { message: 'Registered' };

    service.register(payload.username, payload.email, payload.password).subscribe((response) => {
      expect(response).toEqual(responseBody);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/users/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(responseBody);
  });

  it('removes the persisted user on logout', () => {
    localStorage.setItem('user', JSON.stringify({ username: 'Alpha' }));

    service.logout();

    expect(localStorage.getItem('user')).toBeNull();
  });

  it('parses the stored user when present', () => {
    const mockUser = { username: 'Alpha', email: 'alpha@example.com' };
    localStorage.setItem('user', JSON.stringify(mockUser));

    const user = service.getCurrentUser();

    expect(user).toEqual(mockUser);
  });

  it('returns null when no user is persisted', () => {
    expect(service.getCurrentUser()).toBeNull();
  });
});
