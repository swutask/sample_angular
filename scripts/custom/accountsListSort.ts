import {
    Pipe,
    PipeTransform
} from '@angular/core';
import {
    ExportedClass as TAccount
} from './TAccount';

@Pipe({
    name: 'accountsListSort'
})
export class AccountsListSortPipe implements PipeTransform {

    transform(list: TAccount[], propertyName: string): any {
        let order  = propertyName.split(' ').length>1?propertyName.split(' ')[1]:'asc';
        const result = list.sort((a, b) => {
            let value1 =  a[propertyName.split(' ')[0]] || '';
            let value2 =  b[propertyName.split(' ')[0]] || '';

            if (propertyName.split(' ')[0] === 'name') {
                value1 = value1.toUpperCase();
                value2 = value2.toUpperCase();
            }
            if (propertyName.split(' ')[0] === 'createdAt') {
                return this.compareDate(new Date(a.createdAt), new Date(b.createdAt));
            }
            if (propertyName.split(' ')[0] === 'assetAssociation') {
                value1 = this.getAssetAssociationValue(list, a);
                value2 = this.getAssetAssociationValue(list, b);
            }
            if(order == 'asc'){
                if (value1 < value2) {
                    return -1;
                } else if (value1 > value2) {
                    return 1;
                } else {
                    return 0;
                }
            }
            else{
                if (value1 > value2) {
                    return -1;
                } else if (value1 < value2) {
                    return 1;
                } else {
                    return 0;
                }
            }

        });
        return result;
    }

    private compareDate(date1: Date, date2: Date): number {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const same = d1.getTime() === d2.getTime();
        if (same) {
            return 0;
        }
        if (d1 > d2) {
            return 1;
        }
        if (d1 < d2) {
            return -1;
        }
    }

    private getAssetAssociationValue(list: TAccount[], account) {
        const associatedAsset = list.find(item => item.id === account.assetAssociation);
        return account.assetAssociation !== 'none' && associatedAsset ? associatedAsset.name : '';
    }

}

export {
    AccountsListSortPipe as ExportedClass
};
