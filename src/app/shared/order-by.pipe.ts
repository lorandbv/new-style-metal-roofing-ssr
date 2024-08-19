import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
  standalone: true,
})
export class OrderByPipe implements PipeTransform {
  transform(value: any[], property: string, nestedProperty?: string): any {
    if (nestedProperty) {
      value.sort((first: any, second: any) => {
        return first[property][nestedProperty]
          ?.toLowerCase()
          ?.localeCompare(second[property][nestedProperty]?.toLowerCase());
      });
    } else {
      value.sort((first: any, second: any) => {
        return first[property]
          ?.toLowerCase()
          ?.localeCompare(second[property].toLowerCase());
      });
    }

    return value;
  }
}
