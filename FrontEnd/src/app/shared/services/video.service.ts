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

    createVideo(data): Observable<any> {
        if (data.preference.switchBackEnd==="FIREBASE") {
            this.CURRENT_API_URL = this.API_URL_FIREBASE;
        } else {
            this.CURRENT_API_URL = this.API_URL_LOCAL;
        }
        if (data.preference.switchDataBase==="FIRESTORE") {
            this.CURRENT_API_URL += "/fire";
        } else if (data.preference.switchDataBase==="REALTIME") {
            this.CURRENT_API_URL += "/real";
        }
        return this.http.post(this.CURRENT_API_URL, data.video, { responseType: 'json' });
    }

    updateVideo(data): Observable<any> {
        if (data.preference.switchBackEnd==="FIREBASE") {
            this.CURRENT_API_URL = this.API_URL_FIREBASE;
        } else {
            this.CURRENT_API_URL = this.API_URL_LOCAL;
        }
        if (data.preference.switchDataBase==="FIRESTORE") {
            this.CURRENT_API_URL += "/fire";
        } else if (data.preference.switchDataBase==="REALTIME") {
            this.CURRENT_API_URL += "/real";
        }
        return this.http.put(this.CURRENT_API_URL + '/' + data.video.videoId, data.video,  { responseType: 'json' });
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
        return this.http.get(this.CURRENT_API_URL, { responseType: 'json' });
    }

    deleteVideo(data): Observable<any> {
        if (data.preference.switchBackEnd==="FIREBASE") {
            this.CURRENT_API_URL = this.API_URL_FIREBASE;
        } else {
            this.CURRENT_API_URL = this.API_URL_LOCAL;
        }
        if (data.preference.switchDataBase==="FIRESTORE") {
            this.CURRENT_API_URL += "/fire";
        } else if (data.preference.switchDataBase==="REALTIME") {
            this.CURRENT_API_URL += "/real";
        }
        return this.http.delete(this.CURRENT_API_URL + '/' + data.video.videoId, { responseType: 'json' });
    }

}


