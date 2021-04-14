import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, defaultIfEmpty } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { VideoGAPI } from '../models/videoGAPI.interface';

@Injectable({
    providedIn: 'root'
})
export class WikipediaService {

    // https://en.wikipedia.org/wiki/Special:ApiSandbox
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

    getWiki(q: string, lang: string): Observable<any> {

        let API_URL = `https://${lang}.wikipedia.org/w/api.php?origin=*`;
        this.params.titles = encodeURI(q);
        Object.keys(this.params).forEach(key => API_URL += "&" + key + "=" + this.params[key]);

        /* let count = this.http.get(url + `&action=opensearch&format=json&search=${this.params.titles}`, { responseType: 'json' });
        count.subscribe(res => console.log("getWiki1 : " + res[3][0])); */

        return this.http.get(API_URL, { responseType: 'json' });
    }


}