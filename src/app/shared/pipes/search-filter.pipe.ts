import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generic search filter pipe.
 * Filters an array of objects by checking if any string field
 * contains the search term (case-insensitive).
 *
 * Usage: *ngFor="let item of items | searchFilter: searchTerm : ['name', 'email']"
 */
@Pipe({
  name: 'searchFilter',
  pure: false, // Needed to react to array mutations
})
export class SearchFilterPipe implements PipeTransform {
  transform<T extends Record<string, unknown>>(
    items: T[],
    searchTerm: string,
    fields?: (keyof T)[],
  ): T[] {
    if (!items || !searchTerm?.trim()) {
      return items;
    }

    const term = searchTerm.toLowerCase().trim();

    return items.filter(item => {
      const fieldsToSearch = fields ?? (Object.keys(item) as (keyof T)[]);

      return fieldsToSearch.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        }
        if (typeof value === 'number') {
          return String(value).includes(term);
        }
        return false;
      });
    });
  }
}
