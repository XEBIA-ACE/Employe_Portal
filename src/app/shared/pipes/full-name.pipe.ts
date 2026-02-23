import { Pipe, PipeTransform } from '@angular/core';

interface HasName {
  firstName: string;
  lastName: string;
}

/**
 * Combines firstName and lastName into a display name.
 *
 * Usage: {{ employee | fullName }}
 */
@Pipe({ name: 'fullName' })
export class FullNamePipe implements PipeTransform {
  transform(value: HasName | null | undefined): string {
    if (!value) return '';
    return `${value.firstName} ${value.lastName}`.trim();
  }
}
