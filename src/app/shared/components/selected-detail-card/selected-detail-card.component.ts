import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LayoutService } from 'src/app/shared/services';

@Component({
  selector: 'app-selected-detail-card',
  templateUrl: './selected-detail-card.component.html',
  styleUrls: ['./selected-detail-card.component.scss']
})
export class SelectedDetailCardComponent implements OnInit {
  @Output()
  mobileClick = new EventEmitter();
  @Input() detailTitle?: string;
  @Input() linkText?: string;
  @Input() href?: string;
  @Input() date?: string;
  @Input() noImg?: boolean;

  constructor(public layoutService: LayoutService) {}

  ngOnInit(): void {}
}
