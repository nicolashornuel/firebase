import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QueryWikipedia } from '../models/queryWikipedia.interface';

@Injectable({
    providedIn: 'root'
})
export class WikipediaService {

    private params: QueryWikipedia = {
        origin: "*",
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
        let url = `https://${lang}.wikipedia.org/w/api.php?`;
        this.params.titles = encodeURI(q);
        Object.keys(this.params).forEach(key => url += "&" + key + "=" + this.params[key]);
        return this.http.get(url, { responseType: 'json' });
    }


}