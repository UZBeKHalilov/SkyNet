import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { CheckInDesk, Passenger, QueueStats, FlightInfo, AddPassengerRequest, ChatMessage } from '../models/queue.models';

export interface QueueAppState {
  desks: CheckInDesk[];
  vipQueue: Passenger[];
  regularQueue: Passenger[];
  stats: QueueStats;
  history: Passenger[];
  flights: FlightInfo[];
  isLoading: boolean;
  errorMessage: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private http = inject(HttpClient);
  
  // Update this URL base to map to your .NET Api endpoint (e.g., http://localhost:5000)
  private apiBaseUrl = 'http://localhost:5000/api'; 

  private state$ = new BehaviorSubject<QueueAppState>({
    desks: [],
    vipQueue: [],
    regularQueue: [],
    stats: {
      totalWaitingVIP: 0,
      totalWaitingRegular: 0,
      totalProcessedCount: 0,
      averageWaitTimeVIP: 4,
      averageWaitTimeRegular: 12,
      averageBaggageWeight: 0,
      activeDesksCount: 0
    },
    history: [],
    flights: [],
    isLoading: false,
    errorMessage: null
  });

  public state: Observable<QueueAppState> = this.state$.asObservable();

  constructor() {
    this.refreshState();
  }

  private updateState(partial: Partial<QueueAppState>) {
    this.state$.next({
      ...this.state$.value,
      ...partial
    });
  }

  public refreshState(): void {
    this.updateState({ isLoading: true, errorMessage: null });
    this.http.get<any>(`${this.apiBaseUrl}/queue/state`).pipe(
      tap(res => {
        this.updateState({
          desks: res.desks || [],
          vipQueue: res.vipQueue || [],
          regularQueue: res.regularQueue || [],
          stats: res.stats || this.state$.value.stats,
          history: res.history || [],
          flights: res.flights || [],
          isLoading: false
        });
      }),
      catchError(err => {
        console.error('Error refreshing queue state:', err);
        // Fallback to offline simulations for UI if api is unavailable
        this.updateState({ 
          isLoading: false, 
          errorMessage: 'Unable to sync with .NET Web API. Double check connection settings.' 
        });
        return of(null);
      })
    ).subscribe();
  }

  public addPassenger(request: AddPassengerRequest): Observable<any> {
    this.updateState({ isLoading: true });
    return this.http.post<any>(`${this.apiBaseUrl}/queue/passenger/add`, request).pipe(
      tap(() => this.refreshState()),
      catchError(err => {
        this.updateState({ isLoading: false });
        return of({ error: 'Adding passenger failed.' });
      })
    );
  }

  public simulateBulk(): Observable<any> {
    this.updateState({ isLoading: true });
    return this.http.post<any>(`${this.apiBaseUrl}/queue/passenger/simulate-bulk`, {}).pipe(
      tap(() => this.refreshState()),
      catchError(err => {
        this.updateState({ isLoading: false });
        return of({ error: 'Simulation failed.' });
      })
    );
  }

  public callPassenger(deskId: number): Observable<any> {
    this.updateState({ isLoading: true });
    return this.http.post<any>(`${this.apiBaseUrl}/queue/desk/process`, { deskId }).pipe(
      tap(() => this.refreshState()),
      catchError(err => {
        this.updateState({ isLoading: false });
        return of({ error: 'Calling passenger failed.' });
      })
    );
  }

  public completePassenger(deskId: number): Observable<any> {
    this.updateState({ isLoading: true });
    return this.http.post<any>(`${this.apiBaseUrl}/queue/desk/complete`, { deskId }).pipe(
      tap(() => this.refreshState()),
      catchError(err => {
        this.updateState({ isLoading: false });
        return of({ error: 'Completing check-in failed.' });
      })
    );
  }

  public toggleDesk(deskId: number): Observable<any> {
    this.updateState({ isLoading: true });
    return this.http.post<any>(`${this.apiBaseUrl}/queue/desk/toggle`, { deskId }).pipe(
      tap(() => this.refreshState()),
      catchError(err => {
        this.updateState({ isLoading: false });
        return of({ error: 'Toggling counter status failed.' });
      })
    );
  }

  public resetQueue(): Observable<any> {
    this.updateState({ isLoading: true });
    return this.http.post<any>(`${this.apiBaseUrl}/queue/reset`, {}).pipe(
      tap(() => this.refreshState()),
      catchError(err => {
        this.updateState({ isLoading: false });
        return of({ error: 'Clearing queue state failed.' });
      })
    );
  }

  public askChatAssistant(message: string): Observable<any> {
    const currentState = this.state$.value;
    const body = {
      message,
      contextState: {
        stats: currentState.stats
      }
    };
    return this.http.post<any>(`${this.apiBaseUrl}/api-assistant/answer`, body).pipe(
      catchError(err => {
        console.error('Chat error:', err);
        return of({ 
          text: 'Assistant has problem talking to .NET Core Gateway. Please retry.', 
          source: 'error' 
        });
      })
    );
  }
}
