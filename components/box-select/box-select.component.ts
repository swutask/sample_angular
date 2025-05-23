import { Component, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-box-select',
  templateUrl: './box-select.component.html',
  styleUrls: ['./box-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: BoxSelectComponent,
      multi: true,
    },
  ],
})
export class BoxSelectComponent implements OnInit,ControlValueAccessor {

  @Input('options') options: any; // option object passed to the component
  @Input('colsize') colsize: any=4;

  constructor() { }

  ngOnInit() {}

  onChange: any = (option) => {};
  onTouch: any = () => {};
  onTouched = () => {};
  val = ''; // value of the component
  touched = false;

  disabled = false;
  set value(val) {
    this.val = val;
    this.onChange(val);
    this.onTouch(val);
  }

  // programmatically writing the value
  writeValue(value: any) {
    this.value = value;
  }
  // method to be triggered on UI change
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  // method to be triggered on component touch
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  selectValue(option:any, event: Event){
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.markAsTouched()
    if (!this.disabled) {
      this.val = option.id?option.id:option.value?option.value:option.label;
      this.writeValue(this.val);
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

}

