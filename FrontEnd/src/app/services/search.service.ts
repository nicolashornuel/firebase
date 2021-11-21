import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { QueryGAPI } from '../models/queryGAPI.interface';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private url: string = environment.urlApiYoutube;
  private params = {
    q: null,
    order: null,
    maxResults: 12,
    key: environment.youtubeToken,
    part: "snippet",
    type: "video"
};

  constructor(private http: HttpClient) { }

  getVideos(query: QueryGAPI): Observable<any> {
    this.params.q = encodeURI(query.q);
    this.params.order = query.order;
    this.params.maxResults = query.maxResults;
    let endPoint = `${this.url}/youtube/v3/search?`;
    Object.keys(this.params).forEach(key => endPoint += "&" + key + "=" + this.params[key]);
   
    return this.http.get(endPoint)
      .pipe(
        map((response: any) => response.items)
      );
  }

}