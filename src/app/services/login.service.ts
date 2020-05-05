import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    private loggedEvent = new Subject<any>();

    emitLogged() {
        this.loggedEvent.next();
    }

    logged() {
        return this.loggedEvent;
    }
}
