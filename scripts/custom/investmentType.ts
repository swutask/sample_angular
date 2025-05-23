import {
    Pipe,
    PipeTransform
} from '@angular/core';

@Pipe({
    name: 'investmentType'
})
export class InvestmentTypePipe implements PipeTransform {

    transform(propertyName: string): any {
        switch(propertyName){
            case 'portfolio':
                return 'Portfolio';
            case 'stock':
                return 'Securities';
            case 'units':
                return 'Units';
            case 'zeroValue':
                return 'Zero Value';
            default:
                return propertyName;
        }
    }
}

export {
    InvestmentTypePipe as ExportedClass
};
