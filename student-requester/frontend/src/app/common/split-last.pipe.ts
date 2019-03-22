import { PipeTransform, Pipe } from "@angular/core";

@Pipe({ name: 'splitLast' })
export class SplitLastPipe implements PipeTransform {
    transform(value: string, args?: any): any {
        console.log(value);
        if(value == null){
            return "error"
        }
        else {
        var sp = value.split('&');
        if(sp.length > 1)
        return sp.pop();
        else
        return "error"
    }
    }
}
