import { Pipe, PipeTransform } from '@angular/core';

/**
 * Truncates a string to the given maximum length, appending an ellipsis
 * if the string was shortened.
 *
 * Usage: {{ 'Long text here' | truncate:20 }}
 *        {{ 'Long text here' | truncate:20:'...' }}
 */
@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, maxLength: number, suffix = '…'): string {
    if (!value) return '';
    if (value.length <= maxLength) return value;
    return value.slice(0, maxLength).trimEnd() + suffix;
  }
}
