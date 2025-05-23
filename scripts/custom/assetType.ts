import {
    Pipe,
    PipeTransform
} from '@angular/core';

@Pipe({
    name: 'assetType'
})
export class AssetTypePipe implements PipeTransform {

    transform(propertyName: string): any {
        switch(propertyName){
            case 'C':
                return 'Consumer';
            case 'DA':
                return 'Depreciating Asset';
            case 'AA':
                return 'Appreciating Asset';
            case 'CFA':
                return 'Cash Flow Asset';
            default:
                return propertyName;
        }
    }
}

export {
    AssetTypePipe as ExportedClass
};
