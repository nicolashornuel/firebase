import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs/operators';
import { NewsRss } from 'src/app/models/news-rss.interface';
import { DestroyService } from 'src/app/services/destroy.service';
import { RssService } from 'src/app/services/rss.service';

@Component({
  selector: 'app-rss-flux',
  templateUrl: './rss-flux.component.html',
  styleUrls: ['./rss-flux.component.scss']
})
export class RssFluxComponent implements OnInit {
  private rssUrl: string[] = [
    'https://www.developpez.com/index/rss',
    'https://www.leprogres.fr/rss',
    'https://www.leprogres.fr/france-monde/rss',
    'http://www.dna.fr/une-region/rss',
    'http://www.ledauphine.com/actualite/a-la-une/rss'
  ];
  public rssThread: string = '';
  private counter: number = 0;
  @ViewChild('child') child: ElementRef;
  private readingLoop: number = 1000;

  constructor(private rss: RssService, private destroy$: DestroyService) {}

  ngOnInit(): void {
    this.fetchData(this.rssUrl[0]);
  }

  /**
   * GET xml
   *
   * @private
   * @memberof RssFluxComponent
   */
  private fetchData(url: string): void {
    this.rss
      .getRSSFeedData(url)
      .pipe(take(1))
      .subscribe(async data =>{
        await this.transformData(data);
      });
  }

  /**
   * TRANSFORM xml to string
   *
   * @private
   * @param {*} data
   * @memberof RssFluxComponent
   */
  private async transformData(data: any) {
    const result: NewsRss = await this.rss.parseRSS(data);
    const items = result.rss.channel[0].item;
    const counter = items.length;
    this.rssThread = '';
    for (const key in items) {
      if (Object.prototype.hasOwnProperty.call(items, key)) {
        const element = items[key].title[0];
        this.rssThread += ` -- ${key}/${counter} : ${element}`;
      }
    }
    this.readingLoop = this.rssThread.length * 100;
    this.child.nativeElement.style.animation = `defilement-rtl ${
      this.rssThread.length / 10
    }s infinite linear`;
    this.updateFeed();
  }

  /**
   * UPDATE FEED RSS
   *
   * @private
   * @memberof RssFluxComponent
   */
  private updateFeed(): void {
    setTimeout(() => {
      this.counter++;
      this.fetchData(this.rssUrl[this.counter]);
      if (this.counter > this.rssUrl.length) this.counter = 0;
      this.counter++;
    }, this.readingLoop);
  }
}
