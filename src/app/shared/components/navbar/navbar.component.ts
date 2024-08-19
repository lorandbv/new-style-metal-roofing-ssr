import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { filter } from 'rxjs';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  @ViewChild('collapseBtn') collapseBtn: ElementRef;
  activeRoute: string;
  private storage: Storage;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public utils: UtilsService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.storage = document.defaultView?.localStorage;

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event?.url;
        if (
          !this.collapseBtn?.nativeElement?.classList?.contains('collapsed')
        ) {
          this.collapseBtn.nativeElement?.click();
        }
      });
    this.route.queryParams.subscribe((params) => {
      if (
        params['isAdmin'] ===
          'MarianMacavei_080a0766-9721-4017-8433-55ead46a8d91' ||
        JSON.parse(this.storage?.getItem('isAdmin') ?? '{}') === true
      ) {
        this.storage?.setItem('isAdmin', 'true');
        this.utils.isAdmin.set(true);
      }
    });
  }

  exitAdminMode() {
    this.storage?.removeItem('isAdmin');
    this.utils.isAdmin.set(false);
  }
}
