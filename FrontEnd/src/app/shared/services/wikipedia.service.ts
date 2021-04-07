import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { VideoGAPI } from '../models/videoGAPI.interface';

@Injectable({
    providedIn: 'root'
})
export class WikipediaService {

    // https://en.wikipedia.org/wiki/Special:ApiSandbox
    private API_URL_FR = "https://fr.wikipedia.org/w/api.php";
    private API_URL_EN = "https://en.wikipedia.org/w/api.php";
    private params = {

        action: "query",
        format: "json",
        uselang: "user",

        prop: "extracts",
        titles: null,
        redirects: 1,
        converttitles: 1,

        exintro: 1,
        explaintext: 1,
    };

    constructor(private http: HttpClient) { }

    getWiki(q: string): Observable<any> {
        let url = this.API_URL_FR + "?origin=*";
        this.params.titles = encodeURI(q);
        Object.keys(this.params).forEach(key => url += "&" + key + "=" + this.params[key]);
        let result = this.http.get(url, { responseType: 'json' });
        console.log("getWiki(q: string), result : " + result)
        if (result === null) {
            url = this.API_URL_EN + "?origin=*";
            this.params.titles = encodeURI(q);
            Object.keys(this.params).forEach(key => url += "&" + key + "=" + this.params[key]);
            result = this.http.get(url, { responseType: 'json' });
        }
        return result;
    }


}