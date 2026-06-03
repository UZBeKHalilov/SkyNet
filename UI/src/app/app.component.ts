import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueService, QueueAppState } from './services/queue.service';
import { Subscription } from 'rxjs';

// Inner component imports
import { AirportStatsComponent } from './components/airport-stats/airport-stats.component';
import { PolicyExplainerComponent } from './components/policy-explainer/policy-explainer.component';
import { DeskCardComponent } from './components/desk-card/desk-card.component';
import { PassengerFormComponent } from './components/passenger-form/passenger-form.component';
import { StaffChatComponent } from './components/staff-chat/staff-chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    AirportStatsComponent,
    PolicyExplainerComponent,
    DeskCardComponent,
    PassengerFormComponent,
    StaffChatComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  private queueService = inject(QueueService);
  private sub = new Subscription();

  // Primary state object
  state!: QueueAppState;

  ngOnInit(): void {
    // Listen to reactive stream revisions
    this.sub.add(
      this.queueService.state.subscribe({
        next: (s) => {
          this.state = s;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  refreshState(): void {
    this.queueService.refreshState();
  }

  handleAddPassenger(payload: any): void {
    this.queueService.addPassenger(payload).subscribe();
  }

  handleSimulateBulk(): void {
    this.queueService.simulateBulk().subscribe();
  }

  handleCallPassenger(deskId: number): void {
    this.queueService.callPassenger(deskId).subscribe();
  }

  handleCompletePassenger(deskId: number): void {
    this.queueService.completePassenger(deskId).subscribe();
  }

  handleToggleDesk(deskId: number): void {
    this.queueService.toggleDesk(deskId).subscribe();
  }

  resetQueue(): void {
    this.queueService.resetQueue().subscribe();
  }
}
