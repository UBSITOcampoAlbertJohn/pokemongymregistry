import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GymLeaderService } from '../services/gym-leader.service';
import { LeaderCardComponent } from '../leader-card/leader-card';

@Component({
  selector: 'app-leader-list',
  standalone: true,
  imports: [LeaderCardComponent],
  templateUrl: './leader-list.html',
  styleUrl: './leader-list.css'
})
export class LeaderListComponent implements OnInit {
  private leaderService = inject(GymLeaderService);
  private router = inject(Router);

  selectedRegion = signal<string>('All');

  // Expose signals from service for template binding
  leaders = this.leaderService.leaders;
  filteredLeaders = this.leaderService.filteredLeaders;
  kantoCount = this.leaderService.kantoCount;
  johtoCount = this.leaderService.johtoCount;
  hoennCount = this.leaderService.hoennCount;

  ngOnInit(): void {
    this.leaderService.fetchLeaders().subscribe();
  }

  setFilter(region: string): void {
    this.selectedRegion.set(region);
    this.leaderService.setFilterRegion(region);
  }

  onEditLeader(id: string): void {
    this.router.navigate(['/leaders', id, 'edit']);
  }

  onDeleteLeader(id: string): void {
    if (confirm('Are you sure you want to delete this Gym Leader from the Silph OS Registry?')) {
      this.leaderService.deleteLeader(id).subscribe();
    }
  }
}