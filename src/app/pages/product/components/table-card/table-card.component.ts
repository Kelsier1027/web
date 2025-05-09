import { Component, Input, OnInit } from '@angular/core';
import { ProductSpec } from 'src/app/models';

@Component({
  selector: 'app-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss'],
})
export class TableCardComponent implements OnInit {
  @Input()
  data: ProductSpec[] = [];

  constructor() {}

  ngOnInit(): void {}
}
