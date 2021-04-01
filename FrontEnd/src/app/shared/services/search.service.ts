import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private API_URL = 'https://www.googleapis.com/youtube/v3/search';
  private API_TOKEN = 'AIzaSyDhkZWj-Pp9cPApBeWn94XO43gGpMCith0';

  constructor(private http: HttpClient) { }

  oldGetVideos(query: string): Observable<any> {
    const url = `${this.API_URL}?q=${query}&key=${this.API_TOKEN}&part=snippet&order=viewCount&type=video&maxResults=10`;
    return this.http.get(url)
      .pipe(
        map((response: any) => response.items)
      );
  }

  getVideos(query: any): Observable<any> {
    const url = `${this.API_URL}?q=${query.q}&key=${this.API_TOKEN}&part=snippet&order=${query.order}&type=video&maxResults=${query.maxResults}`;
    return this.http.get(url)
      .pipe(
        map((response: any) => response.items)
      );
  }

}