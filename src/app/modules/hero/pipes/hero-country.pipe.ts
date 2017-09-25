import { Pipe, PipeTransform } from '@angular/core';
import { IqRefactorPipe } from "app/shared/index";

@Pipe({ name: 'hero_country' })
export class HeroCountry extends IqRefactorPipe {

    constructor(){
      super();
    }

    transform(key: string, expression: any[]) : string {
      return super.transform(key,"中国,CN;美国,US;英国,UK;法国,FR;其他,OT");
    }
}
