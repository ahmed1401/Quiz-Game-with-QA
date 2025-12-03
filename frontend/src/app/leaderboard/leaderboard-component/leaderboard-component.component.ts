import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


interface UserScore {
  _id: string;  
  username: string;
  scores: number[];
}

@Component({
  selector: 'app-leaderboard-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard-component.component.html',
  styleUrl: './leaderboard-component.component.css'
})
export class LeaderboardComponent implements OnInit {
  users: UserScore[] = [];

  constructor(private http: HttpClient,
              private router: Router
  ) {}

  ngOnInit() {
    this.fetchLeaderboard();
  }
  
  goToWelcome() {
    this.router.navigate(['/welcome']);
  }
  
  private fetchLeaderboard() {
    this.http.get<UserScore[]>('http://localhost:5000/api/users/leaderboard')
      .subscribe({
        next: (data) => {
          console.log('Received leaderboard data:', data);
        this.users = data.sort((a, b) => {
          const totalA = this.calculateTotalScore(a.scores);
          const totalB = this.calculateTotalScore(b.scores);
          return totalB - totalA; //sorting the total score
        });
        },
        error: (error) => {
          console.error('Error fetching leaderboard:', error);
        }
      });
  }

  calculateTotalScore(scores: number[]): number {
    return scores.reduce((sum, score) => sum + score, 0);
  }
}