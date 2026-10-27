import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GymLeaderService } from '../services/gym-leader.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  private leaderService = inject(GymLeaderService);

  kantoCount = this.leaderService.kantoCount;
  johtoCount = this.leaderService.johtoCount;
  hoennCount = this.leaderService.hoennCount;

  ngOnInit(): void {
    this.leaderService.fetchLeaders().subscribe();
  }
}