import { Component, Input } from '@angular/core';

/**
 * Page header component with title, subtitle, and an action slot.
 * Used at the top of each feature page.
 */
@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  /** Main page title */
  @Input() title = '';

  /** Optional subtitle */
  @Input() subtitle = '';

  /** Optional Material icon name */
  @Input() icon = '';
}
