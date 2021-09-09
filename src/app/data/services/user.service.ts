import { Injectable } from '@angular/core';
import {environment} from '@env';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '@data/models/user.model';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject$ = new BehaviorSubject<User>(null);
  public user$ = this.userSubject$.asObservable();

  private apiEndpoint = `${environment.globalSymbolsApiBase}/user`;

  constructor(private http: HttpClient) {
    this.load();
  }

  load() {
    this.http.get<User>(this.apiEndpoint).subscribe(user => this.userSubject$.next(user));
  }

  get(): Observable<User> {
    return this.http.get<User>(this.apiEndpoint)
      .pipe(map(data => new User().deserialise(data)));
  }

  update(record: User): Observable<User> {
    // Calls the API to update the user record.
    // Casts the response to a User object.
    // Broadcasts the updated User on userSubject$.
    return this.http.patch<User>(this.apiEndpoint, record)
      .pipe(
        map(new User().deserialise),
        tap(user => this.userSubject$.next(user))
      );
  }
}
