import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
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
  showInputSearch: boolean = false;
  categories: any = [];

  constructor(private router: Router, private videoService: VideoService) { }

  ngOnInit(): void {
    this.getCategorie();
  }

  getCategorie() {
    this.videoService.findAll().pipe(take(1)).subscribe(array => {
      this.categories = new Set(array.map(item => item.categorie));
    })
  }

  showTable(categorie: string) {
    if (this.drawer.opened) {
      this.drawer.close();
    }
    this.router.navigateByUrl(`table/${categorie}`);
  }

  onEnter(value: string) {
    this.router.navigateByUrl(`list/${value}`);
  }

  toogleInput() {
    this.showInputSearch = !this.showInputSearch;
    if (this.drawer.opened) {
      this.drawer.close();
    }
    if (this.box !== undefined) {
      if (this.box.nativeElement.value !== "") {
        this.onEnter(this.box.nativeElement.value);
        this.box.nativeElement.value = ""
      }
    }
  }


}
