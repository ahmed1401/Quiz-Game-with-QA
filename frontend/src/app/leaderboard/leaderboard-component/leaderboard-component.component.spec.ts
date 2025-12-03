import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LeaderboardComponent } from './leaderboard-component.component';

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent;
  let fixture: ComponentFixture<LeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderboardComponent, HttpClientTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
