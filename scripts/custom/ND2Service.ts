import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ExportedClass as TND2Calculator } from './TND2Calculator';
import { ExportedClass as UserService } from '../custom/userService';

@Injectable()
class ND2Service {

    constructor(
        private userSvc: UserService,
    ) { }
}

export { ND2Service as ExportedClass };
