import { Pipe, PipeTransform } from '@angular/core';

/** Extracts initials from a full name, e.g. "John Doe" → "JD" */
@Pipe({ name: 'initials', standalone: true })
export class InitialsPipe implements PipeTransform {
  transform(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('');
  }
}
