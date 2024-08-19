import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../shared/models/models';
import { OrderByPipe } from '../../shared/order-by.pipe';
import { ProductsService } from '../../shared/services/products.service';
import { SEOService } from '../../shared/services/seo.service';
import { UtilsService } from '../../shared/services/utils.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, OrderByPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
  product: Product;
  selectedColor: { img: string; materialName: string; colorName: string };

  constructor(
    private utils: UtilsService,
    private route: ActivatedRoute,
    private seo: SEOService,
    private productsService: ProductsService,
    private meta: Meta,
    private title: Title
  ) {
    effect(
      () => {
        if (this.productsService.productsLoaded()) {
          this.route.params.subscribe((params) => {
            this.getProduct(params['id']);
            this.seo.updateCanonicalUrl(
              `https://newstylemetalroofing.com/products/${params['id']}`
            );

            this.meta.addTags([
              {
                name: 'keywords',
                content: this.product.materials
                  .map((material) => `${this.product.name} ${material.name}`)
                  .join(', '),
              },
              { name: 'robots', content: 'index, follow' },
              {
                name: 'description',
                content: `${this.product.name} - ${this.product.description}`,
              },
              {
                property: 'og:description',
                content: `${this.product.name} - ${this.product.description}`,
              },
              {
                property: 'og:title',
                content: `New Style Metal Roofing - ${this.product.name}`,
              },
              { property: 'og:type', content: 'website' },
              {
                property: 'og:url',
                content: `https://newstylemetalroofing.com/products/${params['id']}`,
              },
              {
                rel: 'canonical',
                href: `https://newstylemetalroofing.com/products/${params['id']}`,
              },
            ]);

            this.title.setTitle(
              `New Style Metal Roofing - ${this.product.name}`
            );
          });
        }
      },
      { allowSignalWrites: true }
    );
  }

  getProduct(id: string) {
    this.utils.isLoading.set(true);
    this.product = this.productsService.products.find(
      (product) => product.name === id.replaceAll('-', ' ')
    )!;
    this.utils.isLoading.set(false);

    this.selectedColor = {
      img: this.product?.materials?.[0].colors?.[0].img,
      materialName: this.product?.materials?.[0].name,
      colorName: this.product?.materials?.[0].colors?.[0].name,
    };
  }

  selectColor(img: string, materialName: string, colorName: string): void {
    this.selectedColor = { img, materialName, colorName };
  }
}
