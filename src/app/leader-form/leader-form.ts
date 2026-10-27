import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GymLeaderService } from '../services/gym-leader.service';
import { GymLeader } from '../models/gym-leader.model';

@Component({
  selector: 'app-leader-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './leader-form.html',
  styleUrl: './leader-form.css'
})
export class LeaderFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private leaderService = inject(GymLeaderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = signal<boolean>(false);
  currentId = signal<string | null>(null);

  leaderForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    region: ['Kanto', [Validators.required]],
    town: ['', [Validators.required]],
    badge: ['', [Validators.required]],
    specialty: ['', [Validators.required]],
    aceLevel: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    motto: ['', [Validators.maxLength(150)]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.currentId.set(id);
      this.leaderService.getLeaderById(id).subscribe({
        next: (leader: GymLeader) => this.leaderForm.patchValue(leader),
        error: () => alert('Failed to load Gym Leader details.')
      });
    }
  }

  onSubmit(): void {
    if (this.leaderForm.invalid) return;

    if (this.isEditMode() && this.currentId()) {
      this.leaderService.updateLeader(this.currentId()!, this.leaderForm.value).subscribe({
        next: () => this.router.navigate(['/leaders']),
        error: (err) => alert('Update failed: ' + err.message)
      });
    } else {
      this.leaderService.addLeader(this.leaderForm.value).subscribe({
        next: () => this.router.navigate(['/leaders']),
        error: (err) => alert('Registration failed: ' + err.message)
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/leaders']);
  }
}