import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: 'splitLast' })
export class SplitLastPipe implements PipeTransform {
    transform(value: string, args?: any): any {
        var sp = value.split('&');
        return sp.pop();
    }
}
