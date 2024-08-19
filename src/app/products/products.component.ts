import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { GalleryComponent } from '../shared/components/gallery/gallery.component';
import { Product } from '../shared/models/models';
import { ProductsService } from '../shared/services/products.service';
import { SEOService } from '../shared/services/seo.service';
import { UtilsService } from '../shared/services/utils.service';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    AddEditProductComponent,
    RouterModule,
    CommonModule,
    GalleryComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  selectedProduct: Product;

  constructor(
    public utils: UtilsService,
    public productsService: ProductsService,
    private seo: SEOService,
    private meta: Meta,
    private title: Title
  ) {
    this.seo.updateCanonicalUrl('https://newstylemetalroofing.com/products');
    this.meta.addTags([
      {
        name: 'keywords',
        content:
          'Bilka Color Range Sheets, Bilka Gotic Tiles, Bilka Britanic Tiles, Bilka Retro Panel Tiles, Bilka Fence Slats, Bilka Gutter System',
      },
      { name: 'robots', content: 'index, follow' },
      {
        name: 'description',
        content:
          'Products: Color Range Sheets, Gotic Tiles, Britanic Tiles, Retro Panel Tiles, Fence Slats, Gutter System',
      },
      {
        property: 'og:description',
        content:
          'Products: Color Range Sheets, Gotic Tiles, Britanic Tiles, Retro Panel Tiles, Fence Slats, Gutter System',
      },
      { property: 'og:title', content: 'New Style Metal Roofing - Products' },
      { property: 'og:type', content: 'website' },
      {
        property: 'og:url',
        content: 'https://newstylemetalroofing.com/products',
      },
      { rel: 'canonical', href: 'https://newstylemetalroofing.com/products' },
    ]);
    this.title.setTitle('New Style Metal Roofing - Products');
  }

  editProduct(event: any, product: Product): void {
    event?.preventDefault();
    event?.stopPropagation();

    this.selectedProduct = product;
  }
}
