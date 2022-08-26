import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as xml2js from 'xml2js';
import { convertableToString, ParserOptions } from 'xml2js';
import { NewsRss } from '../models/news-rss.interface';

// https://github.com/Leonidas-from-XIV/node-xml2js

@Injectable({
  providedIn: 'root'
})
export class RssService {

  constructor(private http: HttpClient) { }

  /**
   * FETCH URL
   *
   * @param {string} url
   * @return {*}  {Observable<any>}
   * @memberof RssService
   */
  public getRSSFeedData(url: string): Observable<any> {
    const requestOptions: object = {
      responseType: 'text'
    };
    return this.http.get<any>(url, requestOptions);
  }

  /**
   * PARSE XML
   *
   * @param {convertableToString} data
   * @return {*}  {Promise<any>}
   * @memberof RssService
   */
  public async parseRSS(data: convertableToString): Promise<NewsRss> {
    const options: ParserOptions = {
      trim: true,  
      explicitArray: true 
    }
    const parser = new xml2js.Parser(options);
    return await parser.parseStringPromise(data);
  }


}
