import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { GymLeader } from '../models/gym-leader.model';

@Injectable({
  providedIn: 'root'
})
export class GymLeaderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/leaders';

  // State Signals
  private leadersSignal = signal<GymLeader[]>([]);
  private filterRegionSignal = signal<string>('All');

  // Exposed Public Signals & Computed Signals
  leaders = this.leadersSignal.asReadonly();
  filterRegion = this.filterRegionSignal.asReadonly();

  filteredLeaders = computed(() => {
    const region = this.filterRegionSignal();
    const list = this.leadersSignal();
    if (region === 'All') return list;
    return list.filter(l => l.region.toLowerCase() === region.toLowerCase());
  });

  kantoCount = computed(() => 
    this.leadersSignal().filter(l => l.region.toLowerCase() === 'kanto').length
  );
  
  johtoCount = computed(() => 
    this.leadersSignal().filter(l => l.region.toLowerCase() === 'johto').length
  );
  
  hoennCount = computed(() => 
    this.leadersSignal().filter(l => l.region.toLowerCase() === 'hoenn').length
  );

  // Operations & API Calls
  fetchLeaders(): Observable<GymLeader[]> {
    return this.http.get<GymLeader[]>(this.apiUrl).pipe(
      tap(data => this.leadersSignal.set(data))
    );
  }

  getLeaderById(id: string): Observable<GymLeader> {
    return this.http.get<GymLeader>(`${this.apiUrl}/${id}`);
  }

  addLeader(leader: GymLeader): Observable<GymLeader> {
    return this.http.post<GymLeader>(this.apiUrl, leader).pipe(
      tap(newLeader => {
        this.leadersSignal.update(list => [...list, newLeader]);
      })
    );
  }

  updateLeader(id: string, leader: GymLeader): Observable<GymLeader> {
    return this.http.put<GymLeader>(`${this.apiUrl}/${id}`, leader).pipe(
      tap(updated => {
        this.leadersSignal.update(list => 
          list.map(item => item._id === id ? updated : item)
        );
      })
    );
  }

  deleteLeader(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.leadersSignal.update(list => list.filter(item => item._id !== id));
      })
    );
  }

  setFilterRegion(region: string): void {
    this.filterRegionSignal.set(region);
  }
}