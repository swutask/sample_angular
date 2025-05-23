import {
    Component
} from '@angular/core';
import {
    Input
} from '@angular/core';
@Component({
    templateUrl: 'TextWithHelpIcon.html',
    selector: 'component-text-with-help-icon',
    styleUrls: ['TextWithHelpIcon.scss']
})
export class TextWithHelpIcon {
    public currentItem: any = null;
    public mappingData: any = {};
    @Input() public helpText: any;
    @Input() public text: any;
    constructor() {}
}