import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { QueryDiscogs } from '../models/queryDiscogs.interface';

@Injectable({
    providedIn: 'root'
})
export class DiscogsService {

    private url: string = environment.urlApiDiscogs;
    private params: QueryDiscogs = {
        q: "",
        per_page: 50,
        token: environment.discogsToken,
        artist: "",
    }

    constructor(private http: HttpClient) { }

    getAll(q: string): Observable<any> {
        this.params.q = encodeURI(q);
        let endPoint = `${this.url}/database/search?`;
        Object.keys(this.params).forEach(key => endPoint += "&" + key + "=" + this.params[key]);
        return this.http.get(endPoint, { responseType: 'json' });
    }

    getByArtistName(queryDiscogs: QueryDiscogs): Observable<any> {
        this.params.artist = encodeURI(queryDiscogs.q);
        this.params.per_page = queryDiscogs.per_page;
        let endPoint = `${this.url}/database/search?`;
        Object.keys(this.params).forEach(key => endPoint += "&" + key + "=" + this.params[key]);
        return this.http.get(endPoint, { responseType: 'json' });
    }

    getContributorById(id: number): Observable<any> {
        let endPoint = `${this.url}/artists/${id}`;
        return this.http.get(endPoint, { responseType: 'json' });
    }

}