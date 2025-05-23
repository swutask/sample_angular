import { Directive, Input } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { NgxMaskService } from 'ngx-mask';

@Directive({
    selector: 'ion-input'
})
export class CustomMaskDirective {
    @Input() mask: any;
    @Input() thousandSeparator: any;
    @Input() dynamicDecimal: boolean;
    @Input() decimalPlaces: number;
    initialMask="0";
    constructor(
        private control: IonInput,
        private maskService: NgxMaskService,
    ) {
        this.maskService.allowNegativeNumbers = true;
        this.maskService.thousandSeparator = this.thousandSeparator || ',';
        this.control.ionInput.subscribe((r: string) => {
            if (this.control.value.toString() === ".") {
                this.control.value = "0.";
            }
            if(this.dynamicDecimal === true) {
                this.maskService.leadZero = true;
                const removeDecimal = this.control.value.toString().replace(/\./g, "") ;
                const trimmedValue = removeDecimal.replace(/^0+/, "");
                const paddedValue = trimmedValue.length < (this.decimalPlaces + 1) ? trimmedValue.padStart(this.decimalPlaces + 1, '0') : trimmedValue;
                const formattedValue = paddedValue.slice(0, -(this.decimalPlaces)) + '.' + paddedValue.slice(-(this.decimalPlaces));
                this.control.value = this.maskService.applyMask(formattedValue, this.mask);
                return;
            }
            if (this.mask)
                this.control.value = this.maskService.applyMask(this.control.value.toString(), this.mask);
        });
    }

}