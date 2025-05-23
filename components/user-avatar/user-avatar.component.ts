import { Component, OnInit, Output } from '@angular/core';
import { Platform } from '@ionic/angular';
import { EventEmitter } from 'events';
import {
  ExportedClass as userService
} from '../../scripts/custom/userService';

@Component({
  selector: 'user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit {
  @Output() clickEvent = new EventEmitter();

  public userAvatar: string;

  constructor(public userSvc: userService, public platform: Platform) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.userSvc.getUser().subscribe(({ data: { user } }) => {
        if (user && user.avatar) {
          this.userSvc.getSignedUrl(user.avatar).
            subscribe((res: any) => {
              if (res) {
                this.userAvatar = res.data.getSignedUrl.signedUrl;
              }
            })
        }
      })
    })
  }

  emmitClickEvent(event) {
    this.clickEvent.emit(event);
  }
}
