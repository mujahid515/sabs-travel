import { Pipe } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe {
  transform(time: string) {
    const arr = time.split('');
    return arr[0] + arr[1] + ':' + arr[2] + arr[3];
  }
}