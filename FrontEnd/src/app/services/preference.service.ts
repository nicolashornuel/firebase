import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { Preference } from '../models/preference.interface';

@Injectable({
    providedIn: 'root'
})
export class PreferenceService {

    private URL_BACKEND: string = environment.urlBack;
    preference: Preference = {
        matSliderValue: null,
        radioBackEnd: null,
        radioDataBase: null,
        switchDiscogs: null,
        maxResultsDiscogs: null,
        switchWikipedia: null,
        switchYoutube: null,
        maxResultsYoutube: null,
        orderYoutube: null
      }

    constructor(private http: HttpClient) { }


    find(): Observable<any> {
        return this.http.get(this.URL_BACKEND + "pref", { responseType: 'json' });
    }

    create(preference: Preference): Observable<any> {
        this.preference = preference;
        return this.http.post(this.URL_BACKEND + "pref", preference, { responseType: 'json' });
    }

    update(preference: Preference): Observable<any> {
        this.preference = preference;
        return this.http.put(this.URL_BACKEND + "pref", preference,  { responseType: 'json' });
    }

}


