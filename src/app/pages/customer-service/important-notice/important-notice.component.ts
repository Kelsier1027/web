import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-important-notice',
  templateUrl: './important-notice.component.html',
  styleUrls: ['./important-notice.component.scss']
})
export class ImportantNoticeComponent implements OnInit {


  currentScreenSize: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  

}
