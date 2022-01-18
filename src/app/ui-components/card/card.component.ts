import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
@Input() public name:string | undefined;
@Input() public rate:string| undefined;
@Input() public campaing:string|undefined;
@Input() public image:any;

  constructor() { }

  ngOnInit(): void {
  }

}
