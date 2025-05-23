import {
    Pipe,
    PipeTransform
} from '@angular/core';

@Pipe({
    name: 'search',
})
export class SearchPipe implements PipeTransform {

    transform(list: any[], propertyName: string, searchTerm: string): any {
        if (!list) {
            return [];
        }
        if (!propertyName) {
            return list;
        }
        if (!searchTerm) {
            return list;
        }
        return list.filter(item => {
            if (item.childAccount) {
                const matchSubAccount = item.childAccount.filter(child => {
                    return (child[propertyName].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
                })
                if (matchSubAccount.length > 0) {
                    return true;
                }
            }
            return (item[propertyName].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
        }).map( item => {
            if (item.childAccount) {
                const matchSubAccount = item.childAccount.filter(child => {
                    return (child[propertyName].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
                })
                if (matchSubAccount.length > 0) {
                    item.toggleIconAccount = true;
                }
                else {
                    item.toggleIconAccount = false;
                }
            }
            return item;
        });
    }

}

export {
    SearchPipe as ExportedClass
};