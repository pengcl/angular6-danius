import {Component, OnInit} from '@angular/core';
import {NavbarService} from '../../../../../modules/navbar';
import {TabbarService} from '../../../../../modules/tabbar';

import {ProductService} from '../../../services/product.service';

@Component({
  selector: 'app-front-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})

export class FrontTypesComponent implements OnInit {
  types: any[] = [];
  selectedType = null;

  constructor(private navSvc: NavbarService,
              private tabSvc: TabbarService,
              private prodSvc: ProductService) {
    navSvc.set({title: '金山优选-分类列表'});
    tabSvc.set({show: true}, 1);
  }

  ngOnInit() {
    this.prodSvc.getCatalogs().then(res => {
      this.types = res.childList;
      this.selectedType = this.types.length > 0 ? this.types[0] : null;
    });
  }

  setType(type) {
    this.selectedType = type;
  }
}
