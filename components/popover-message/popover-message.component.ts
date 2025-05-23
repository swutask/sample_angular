import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover-message',
  templateUrl: './popover-message.component.html',
  styleUrls: ['./popover-message.component.scss'],
})
export class PopoverMessageComponent implements OnInit {

  @Input() textMsg:string;
  @Input() instruction:boolean = false;

  constructor() { }

  ngOnInit() {}

}
