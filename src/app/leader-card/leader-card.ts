import { Component, input, output } from '@angular/core';
import { GymLeader } from '../models/gym-leader.model';

@Component({
  selector: 'app-leader-card',
  standalone: true,
  templateUrl: './leader-card.html',
  styleUrl: './leader-card.css'
})
export class LeaderCardComponent {
  leader = input.required<GymLeader>();
  edit = output<string>();
  remove = output<string>();

  onEdit(): void {
    if (this.leader()._id) {
      this.edit.emit(this.leader()._id!);
    }
  }

  onRemove(): void {
    if (this.leader()._id) {
      this.remove.emit(this.leader()._id!);
    }
  }
}