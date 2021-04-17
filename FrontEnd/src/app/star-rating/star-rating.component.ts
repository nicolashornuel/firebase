import { Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent {

  @Input('rating') rating: number;
  @Input() ratingArr: number[] = [0,1,2,3,4];
  @Output() ratingUpdated = new EventEmitter();

  constructor() {
  }

  onClick(rating:number) {
    console.log(rating);
    
    this.rating = rating;
    this.ratingUpdated.emit(rating);
  }

  showIcon(index:number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

}



