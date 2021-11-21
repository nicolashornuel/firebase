import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../environments/environment.prod';
import {Preference} from '../models/preference.interface';
import {filter, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {
  private URL_BACKEND: string = environment.urlBack;
  private preference$: BehaviorSubject<Preference> =
    new BehaviorSubject<Preference>(null);

  constructor(private http: HttpClient) {}

  /**
   * READ preference FROM database
   *
   * @return {*}  {Observable<Preference>}
   * @memberof PreferenceService
   */
  public find(): Observable<Preference> {
    const result = this.http
      .get<Preference[]>(this.URL_BACKEND + 'pref', {
        responseType: 'json'
      })
      .pipe(
        map((preferences: Preference[]) => {
          return preferences[0];
        }),
        tap((preference: Preference) => this.setPreference(preference))
      );
    return result;
  }

  /**
   * CREATE preference into database
   *
   * @param {Preference} preference
   * @return {*}  {Observable<Preference>}
   * @memberof PreferenceService
   */
  public create(preference: Preference): Observable<Preference> {
    const result = this.http.post<Preference>(
      this.URL_BACKEND + 'pref',
      preference,
      {
        responseType: 'json'
      }
    );
    this.setPreference(preference);
    return result;
  }

  /**
   * UPDATE preference into database
   *
   * @param {Preference} preference
   * @return {*}  {Observable<Preference>}
   * @memberof PreferenceService
   */
  public update(preference: Preference): Observable<Preference> {
    const result = this.http.put<Preference>(
      this.URL_BACKEND + 'pref',
      preference,
      {
        responseType: 'json'
      }
    );
    this.setPreference(preference);
    return result;
  }

  /**
   * GETTER Preference inside global app
   *
   * @readonly
   * @type {Observable<Preference>}
   * @memberof PreferenceService
   */
  public get getPreference$(): Observable<Preference> {
    return this.preference$.asObservable();
  }

  /**
   * SETTER Preference inside global app
   *
   * @param {Preference} preference
   * @memberof PreferenceService
   */
  public setPreference(preference: Preference): void {
    this.preference$.next(preference);
  }
}
