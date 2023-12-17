import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable({
  providedIn: 'root'
})
export class IconSvgRegistryService {

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.iconRegistry.addSvgIcon('highpass', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/highpass.svg'));
    this.iconRegistry.addSvgIcon('bandpass', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/bandpass.svg'));
    this.iconRegistry.addSvgIcon('lowpass', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/lowpass.svg'));
    this.iconRegistry.addSvgIcon('none', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/none.svg'));
    this.iconRegistry.addSvgIcon('sine', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/sine.svg'));
    this.iconRegistry.addSvgIcon('square', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/square.svg'));
    this.iconRegistry.addSvgIcon('triangle', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/triangle.svg'));
    this.iconRegistry.addSvgIcon('sawtooth', this.sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/saw.svg'));
  }
}
