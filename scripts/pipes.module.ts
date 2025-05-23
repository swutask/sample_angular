import {
    NgModule
} from '@angular/core';
import {
    IonicModule
} from '@ionic/angular';
import {
    ExportedClass as accountsListSort
} from './custom/accountsListSort';
import {
    ExportedClass as search
} from './custom/search';
import {
    ExportedClass as assetType
} from './custom/assetType';
import { 
    ExportedClass as SafePipe 
} from './custom/SafePipe';
import {
    ExportedClass as investmentType
} from './custom/investmentType';
@NgModule({
    declarations: [
        accountsListSort,
        search,
        assetType,
        SafePipe,
        investmentType,
    ],
    imports: [IonicModule],
    exports: [
        accountsListSort,
        search,
        assetType,
        SafePipe,
        investmentType,
    ]
})
export class PipesModule {}