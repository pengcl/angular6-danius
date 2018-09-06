import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  charts = [
    {
      x: 2097,
      y: 49
    },
    {
      x: 2096,
      y: 49
    },
    {
      x: 2095,
      y: 49
    },
    {
      x: 2094,
      y: 49
    },
    {
      x: 2093,
      y: 49
    },
    {
      x: 2092,
      y: 49
    },
    {
      x: 2091,
      y: 49
    },
    {
      x: 2090,
      y: 49
    },
    {
      x: 2089,
      y: 49
    },
    {
      x: 2088,
      y: 49
    }
  ];

  constructor() {
  }

  ngOnInit() {
    console.log(this.charts);
    const $container = document.getElementById('#chartsContainer');
    console.log($container);
  }
}
