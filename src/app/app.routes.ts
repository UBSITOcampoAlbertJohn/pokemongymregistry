import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LeaderListComponent } from './leader-list/leader-list';
import { LeaderFormComponent } from './leader-form/leader-form';
import { NotFoundComponent } from './not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Pokémon League - Home' },
  { path: 'leaders', component: LeaderListComponent, title: 'Gym Leader Registry' },
  { path: 'leaders/new', component: LeaderFormComponent, title: 'Register Gym Leader' },
  { path: 'leaders/:id/edit', component: LeaderFormComponent, title: 'Edit Gym Leader' },
  { path: '**', component: NotFoundComponent, title: 'Page Not Found' }
];