import { Pipe, PipeTransform } from '@angular/core';

/**
 * Replace occurrences of a substring in a string.
 *
 * Usage: {{ 'on_leave' | replace:'_':' ' }}  →  'on leave'
 */
@Pipe({ name: 'replace' })
export class ReplacePipe implements PipeTransform {
  transform(value: string, search: string, replacement: string): string {
    if (!value) return value;
    return value.split(search).join(replacement);
  }
}
