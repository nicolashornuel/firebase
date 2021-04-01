import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    //private API_URL = 'http://localhost:3000/video/';
    private API_URL = 'http://localhost:5000/fourthproject-aff75/us-central1/app/fire';


    constructor(private http: HttpClient) { }

    createVideo(video: any): Observable<any> {
        return this.http.post(this.API_URL, video, { responseType: 'json' });
    }

    findAll(): Observable<any> {
        return this.http.get(this.API_URL,{ responseType: 'json' });
    }

}


