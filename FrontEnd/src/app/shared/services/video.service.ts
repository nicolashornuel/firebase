import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    private API_URL_LOCAL = 'http://localhost:5001/fourthproject-aff75/us-central1/app';
    private API_URL_FIREBASE = "https://us-central1-fourthproject-aff75.cloudfunctions.net/app";
    private CURRENT_API_URL: string;

    constructor(private http: HttpClient) { }

    createVideo(video: any): Observable<any> {
        return this.http.post(this.API_URL_FIREBASE, video, { responseType: 'json' });
    }

    findAll($event): Observable<any> {
        if ($event.preference.switchBackEnd==="FIREBASE") {
            this.CURRENT_API_URL = this.API_URL_FIREBASE;
        } else {
            this.CURRENT_API_URL = this.API_URL_LOCAL;
        }
        if ($event.preference.switchDataBase==="FIRESTORE") {
            this.CURRENT_API_URL += "/fire";
        } else if ($event.preference.switchDataBase==="REALTIME") {
            this.CURRENT_API_URL += "/real";
        }
        return this.http.get(this.CURRENT_API_URL,{ responseType: 'json' });
    }

}


