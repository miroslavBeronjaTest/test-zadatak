import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  nameOfRoute = '';
  showLeftMenu = false;
  @Output() readonly eventLeftMenu = new EventEmitter<any>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd)
      )
      .subscribe((route: any) => {
        this.nameOfRoute = this.activatedRoute.snapshot.children[0].data.name;
        this.showLeftMenu = false;
        this.eventLeftMenu.emit(this.showLeftMenu);
      });

  }

  openOrCloseLeftMenu(): void {
    this.showLeftMenu = !this.showLeftMenu;
    this.eventLeftMenu.emit(this.showLeftMenu);
  }

}
