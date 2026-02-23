import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PaginationMeta } from '@core/models/api.model';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  type?: 'text' | 'date' | 'badge' | 'avatar' | 'actions';
  badgeConfig?: Record<string, { color: string; label: string }>;
}

export interface TableAction {
  icon: string;
  label: string;
  action: string;
  color?: string;
  visibleWhen?: (row: unknown) => boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <div class="table-container mat-elevation-z2">
      <!-- Loading overlay -->
      <div class="loading-overlay" *ngIf="loading">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <!-- Empty state -->
      <div class="empty-state" *ngIf="!loading && dataSource.length === 0">
        <mat-icon>inbox</mat-icon>
        <p>{{ emptyMessage }}</p>
      </div>

      <table mat-table [dataSource]="dataSource" matSort (matSortChange)="onSort($event)" *ngIf="!loading && dataSource.length > 0">

        <!-- Dynamic columns -->
        <ng-container *ngFor="let col of columns" [matColumnDef]="col.key">
          <th mat-header-cell *matHeaderCellDef [mat-sort-header]="col.sortable ? col.key : ''" [style.width]="col.width">
            {{ col.label }}
          </th>
          <td mat-cell *matCellDef="let row">
            <ng-container [ngSwitch]="col.type">
              <!-- Date -->
              <span *ngSwitchCase="'date'">{{ getCell(row, col.key) | date:'mediumDate' }}</span>

              <!-- Badge -->
              <span *ngSwitchCase="'badge'" class="badge"
                [style.background]="getBadgeColor(col, getCell(row, col.key))">
                {{ getBadgeLabel(col, getCell(row, col.key)) }}
              </span>

              <!-- Avatar -->
              <span *ngSwitchCase="'avatar'" class="avatar-cell">
                <img *ngIf="getCell(row, col.key)" [src]="getCell(row, col.key)" [alt]="'Avatar'" class="avatar-img" />
                <mat-icon *ngIf="!getCell(row, col.key)">account_circle</mat-icon>
              </span>

              <!-- Default text -->
              <span *ngSwitchDefault>{{ getCell(row, col.key) }}</span>
            </ng-container>
          </td>
        </ng-container>

        <!-- Actions column -->
        <ng-container matColumnDef="actions" *ngIf="actions.length > 0">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let row">
            <ng-container *ngFor="let action of actions">
              <button
                mat-icon-button
                *ngIf="!action.visibleWhen || action.visibleWhen(row)"
                [matTooltip]="action.label"
                [color]="action.color || 'default'"
                (click)="onAction(action.action, row)">
                <mat-icon>{{ action.icon }}</mat-icon>
              </button>
            </ng-container>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
      </table>

      <!-- Paginator -->
      <mat-paginator
        *ngIf="pagination && dataSource.length > 0"
        [length]="pagination.total"
        [pageIndex]="pagination.page - 1"
        [pageSize]="pagination.pageSize"
        [pageSizeOptions]="pageSizeOptions"
        (page)="onPage($event)"
        showFirstLastButtons>
      </mat-paginator>
    </div>
  `,
  styles: [`
    .table-container { position: relative; border-radius: 8px; overflow: hidden; }
    .loading-overlay {
      position: absolute; inset: 0; background: rgba(255,255,255,.7);
      display: flex; align-items: center; justify-content: center; z-index: 10;
    }
    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      padding: 48px; color: rgba(0,0,0,.4);
    }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 16px; }
    table { width: 100%; }
    .table-row:hover { background: rgba(0,0,0,.04); cursor: pointer; }
    .badge {
      display: inline-block; padding: 2px 10px; border-radius: 12px;
      font-size: 0.75rem; font-weight: 500; color: #fff; text-transform: uppercase;
    }
    .avatar-cell { display: flex; align-items: center; }
    .avatar-img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
  `]
})
export class DataTableComponent implements OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() dataSource: unknown[] = [];
  @Input() actions: TableAction[] = [];
  @Input() loading = false;
  @Input() pagination?: PaginationMeta;
  @Input() pageSizeOptions = [5, 10, 25, 50];
  @Input() emptyMessage = 'No records found.';

  @Output() sortChange = new EventEmitter<Sort>();
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() actionClick = new EventEmitter<{ action: string; row: unknown }>();

  displayedColumns: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] || changes['actions']) {
      this.displayedColumns = [
        ...this.columns.map((c) => c.key),
        ...(this.actions.length > 0 ? ['actions'] : [])
      ];
    }
  }

  getCell(row: unknown, key: string): unknown {
    return (row as Record<string, unknown>)[key];
  }

  getBadgeColor(col: TableColumn, value: unknown): string {
    return col.badgeConfig?.[String(value)]?.color ?? '#9e9e9e';
  }

  getBadgeLabel(col: TableColumn, value: unknown): string {
    return col.badgeConfig?.[String(value)]?.label ?? String(value);
  }

  onSort(sort: Sort): void {
    this.sortChange.emit(sort);
  }

  onPage(event: PageEvent): void {
    this.pageChange.emit(event);
  }

  onAction(action: string, row: unknown): void {
    this.actionClick.emit({ action, row });
  }
}
