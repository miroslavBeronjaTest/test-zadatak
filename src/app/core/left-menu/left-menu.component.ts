import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss']
})
export class LeftMenuComponent implements OnInit {

  show = false;
  get showLeftMenu(): boolean {
    return this.show;
  }
  @Input() set showLeftMenu(val: boolean) {
    this.show = val;
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  changeRoute(route: string): void {
    this.router.navigate([route]).then(() => {
      this.show = false;
    });
  }


}
