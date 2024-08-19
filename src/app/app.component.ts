import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ImagesService } from './shared/services/images.service';
import { ProductsService } from './shared/services/products.service';
import { SEOService } from './shared/services/seo.service';
import { UtilsService } from './shared/services/utils.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    public utils: UtilsService,
    private seoService: SEOService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private imagesService: ImagesService,
    private productsService: ProductsService
  ) {
    // this.setUpAnalytics();
    this.imagesService.getImages();
    this.productsService.getProducts();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route: any) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter((route: any) => route.outlet === 'primary'),
        mergeMap((route: any) => route.data)
      )
      .subscribe((event: any) => {
        this.seoService.updateTitle(event['title']);
        this.seoService.updateOgUrl(event['ogUrl']);
        this.seoService.updateDescription(event['description']);
        this.seoService.updateKeywords(
          'metal roofing, ' +
            'construction materials, ' +
            'bilka materials, ' +
            'metal roofing ohio, ' +
            'ohio construction materials, ' +
            'ohio metal roofing, ' +
            'new style metal roofing, ' +
            'newstylemetalroofing, ' +
            'ohio tiles, ' +
            'ohio color range tiles, ' +
            'color range tiles, ' +
            'ohio bilka'
        );
      });
  }

  setUpAnalytics() {
    // this.router.events
    //   .pipe(
    //     filter(
    //       (event: any): event is NavigationEnd => event instanceof NavigationEnd
    //     )
    //   )
    //   .subscribe((event: NavigationEnd) => {
    //     gtag('config', 'G-FXXCB7LTX5', {
    //       page_path: event.urlAfterRedirects,
    //     });
    //   });
  }
}
