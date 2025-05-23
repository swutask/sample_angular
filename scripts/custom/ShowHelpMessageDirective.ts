import {Directive, ElementRef, HostListener, OnInit} from '@angular/core';
import { AlertController, PopoverController, PopoverOptions } from '@ionic/angular';
import { PopoverMessageComponent } from 'src/app/components/popover-message/popover-message.component';
/**
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
    selector: '[name="help-circle-outline"]' // Attribute selector
})

export default class ShowHelpMessageDirective implements OnInit {

    constructor(private alertController: AlertController, private el: ElementRef, private popCtrl: PopoverController) { }

    ngOnInit() {
        //this.el.nativeElement.style.backgroundColor = 'green';
    }

    @HostListener('click', ['$event'])
    onClick(e) {
        this.showHelpMessage(e);
    }

    public async showHelpMessage(ev) {
        try {
            const helpText = this.el.nativeElement.parentElement.querySelector('[helpText]').getAttribute('helpText');
            const instruction = this.el.nativeElement.parentElement.querySelector('[instruction]')?.getAttribute('instruction');
            if (helpText) {
                const options:PopoverOptions = {
                    cssClass: 'help-text-align',
                    component: PopoverMessageComponent,
                    componentProps:{
                        textMsg: helpText,
                        instruction:instruction=="true"?true:false
                    },
                    event: ev,
                    mode:'ios',
                    arrow:true,
                    showBackdrop: false,
                    alignment: 'center'
                }
                const alert = await this.popCtrl.create(options);
                return await alert.present();
            }
        } catch (e) {}
    }
}

/*
    Directive class should be exported as ExportedClass
*/
export { ShowHelpMessageDirective as ExportedClass };