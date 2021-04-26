import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Preference } from 'src/app/models/preference.interface';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @ViewChild('drawer') public drawer;
  @ViewChild('box') public box;
  showInputSearch: boolean = true;
  preference: Preference = {
    matSliderValue: null,
    radioBackEnd: null,
    radioDataBase: null,
    switchDiscogs: null,
    maxResultsDiscogs: null,
    switchWikipedia: null,
    switchYoutube: null,
    maxResultsYoutube: null,
    orderYoutube: null
  }
  categories: any = [];

  constructor(private router: Router, private videoService: VideoService) { }

  ngOnInit(): void {
    this.getCategorie();
  }

  getCategorie() {
    this.videoService.findAll().subscribe(array => {
      this.categories = new Set(array.map(item => item.categorie));
    })
  }

  showTable(categorie: string) {
    if (this.drawer.opened) {
      this.drawer.close();
    }
    let extras: NavigationExtras = {
      skipLocationChange: false,
      replaceUrl: true,
      queryParams: { q: categorie },
      state: this.preference
    };
    this.router.navigateByUrl('/').then(() =>
      this.router.navigate(['table'], extras));
  }

  onEnter(value: string) {
    let extras: NavigationExtras = {
      skipLocationChange: false,
      replaceUrl: true,
      queryParams: { q: value },
      state: this.preference
    };
    this.router.navigateByUrl('/').then(() =>
      this.router.navigate(['list'], extras));
  }

  toogleInput() {
    this.showInputSearch = !this.showInputSearch;
    if (this.drawer.opened) {
      this.drawer.close();
    }
    if (this.box != undefined) {
      if (this.box.nativeElement.value != "") {
        this.onEnter(this.box.nativeElement.value);
      }
    }
  }

  refreshPref($event) {
    this.preference = $event.preference;
    this.drawer.close();
  }

}
