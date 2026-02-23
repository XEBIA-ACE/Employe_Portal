import { Component, Input } from '@angular/core';

/**
 * Reusable loading spinner component.
 * Can be used inline (e.g., inside a button or card) or as an overlay.
 */
@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent {
  /** Spinner diameter in pixels */
  @Input() diameter = 40;

  /** Optional message to display below the spinner */
  @Input() message = '';

  /** If true, renders with an overlay background */
  @Input() overlay = false;
}
