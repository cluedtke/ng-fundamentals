import { Injectable } from '@angular/core';
import { IUser } from './user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthService {
    currentUser: IUser;

    constructor(
        private http: HttpClient,
    ) { }

    loginUser(userName: string, password: string) {
        const loginInfo = { username: userName, password: password };
        const options = { headers: new HttpHeaders({ 'content-type': 'application/json'}) };

        return this.http.post('/api/login', loginInfo, options)
            .pipe(tap(data => {
                this.currentUser = <IUser>data['user'];
            }))
            .pipe(catchError(err => {
                return of(false);
            }));
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    checkAuthorizationStatus() {
        this.http.get('/api/currentIdentity')
            .pipe(tap(data => {
                this.currentUser = <IUser>data;
            }))
            .subscribe();
    }

    updateCurrentUser(firstName: string, lastName: string) {
        this.currentUser.firstName = firstName;
        this.currentUser.lastName = lastName;

        const options = { headers: new HttpHeaders({ 'content-type': 'application/json'}) };
        return this.http.put(`/api/users/${this.currentUser.id}`, this.currentUser, options);
    }

    logout() {
        const options = { headers: new HttpHeaders({ 'content-type': 'application/json'}) };
        return this.http.post('/api/logout', {}, options);
    }
}
