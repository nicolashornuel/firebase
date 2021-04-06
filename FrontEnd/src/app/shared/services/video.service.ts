import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    private API_URL_LOCAL = 'http://localhost:5001/fourthproject-aff75/us-central1/app/fire';
    private API_URL_FIREBASE = "https://us-central1-fourthproject-aff75.cloudfunctions.net/app/fire";
    private CURRENT_API_URL: string;

    constructor(private http: HttpClient) { }

    createVideo(video: any): Observable<any> {
        return this.http.post(this.API_URL_FIREBASE, video, { responseType: 'json' });
    }

    findAll($event): Observable<any> {
        if ($event.switchBackEnd==="FIREBASE" || $event.switchBackEnd===null) {
            this.CURRENT_API_URL = this.API_URL_FIREBASE;
        } else {
            this.CURRENT_API_URL = this.API_URL_LOCAL;
        }
        console.log(this.CURRENT_API_URL);
        return this.http.get(this.CURRENT_API_URL,{ responseType: 'json' });
    }

}


