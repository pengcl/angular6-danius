import {Component, OnInit} from '@angular/core';
import {OverlayService} from './overlay.service';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {

  aniClass;

  constructor(private overlaySvc: OverlayService) {
    overlaySvc.get().subscribe(res => {
      this.aniClass = (!!res ? 'fadeInUpBig animated' : 'fadeOutDownBig animated');
    });
  }

  ngOnInit() {
  }
}
