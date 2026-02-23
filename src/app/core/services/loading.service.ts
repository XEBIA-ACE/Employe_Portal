import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

/**
 * Global loading indicator service.
 * Used by the loading interceptor to show/hide the spinner.
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private requestCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);

  /** Observable that emits true when any HTTP request is in flight */
  readonly isLoading$: Observable<boolean> = this.loadingSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  /** Called by the loading interceptor when a request starts */
  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  /** Called by the loading interceptor when a request completes or errors */
  hide(): void {
    if (this.requestCount > 0) {
      this.requestCount--;
    }
    if (this.requestCount === 0) {
      this.loadingSubject.next(false);
    }
  }

  /** Force-hide loading (use sparingly) */
  reset(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
  }
}
