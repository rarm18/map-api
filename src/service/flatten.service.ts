import { Injectable } from '@nestjs/common';

@Injectable()
export class FlattenService {
  /**
   * Flattens a nested object into a single-level object
   * @param obj - The object to flatten
   * @param additionalFields - Additional fields to include in the flattened result
   * @param prefix - Prefix for the flattened keys (optional)
   * @returns Flattened object
   */
  flattenObject(
    obj: any,
    additionalFields: Record<string, any> = {},
    prefix = '',
  ): any {
    const flattened: any = { ...additionalFields };

    const flatten = (current: any, path: string) => {
      if (current === null || current === undefined) {
        flattened[path] = null;
        return;
      }

      if (Array.isArray(current)) {
        flattened[path] = JSON.stringify(current);
        return;
      }

      if (typeof current === 'object' && !(current instanceof Date)) {
        for (const key in current) {
          const newPath = path ? `${path}_${key}` : key;
          flatten(current[key], newPath);
        }
      } else {
        flattened[path] = current;
      }
    };

    flatten(obj, prefix);
    return flattened;
  }
}
