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
  }
}
