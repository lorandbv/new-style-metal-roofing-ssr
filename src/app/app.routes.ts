import { Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { AddEditProductComponent } from './products/add-edit-product/add-edit-product.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { ProductsComponent } from './products/products.component';
import { PrivacyPolicyComponent } from './shared/components/privacy-policy/privacy-policy.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'products',
    children: [
      {
        path: '',
        component: ProductsComponent,
        data: {
          title: 'New Style Metal Roofing - Products',
          description: 'Products',
          ogUrl: 'http://newstylemetalroofing.com/products',
        },
      },
      {
        path: 'add',
        component: AddEditProductComponent,
        data: {
          title: 'New Style Metal Roofing - Add Product',
          description: 'Add Product',
          ogUrl: 'http://newstylemetalroofing.com/products/add',
        },
      },
      {
        path: ':id',
        component: ProductDetailsComponent,
        data: {
          title: 'New Style Metal Roofing - Products',
          description: 'Products',
          ogUrl: 'http://newstylemetalroofing.com/products',
        },
      },
    ],
  },
  {
    path: 'contact',
    component: ContactComponent,
    pathMatch: 'full',
    data: {
      title: 'New Style Metal Roofing - Contact',
      description: 'Contact',
      ogUrl: 'http://newstylemetalroofing.com/contact',
    },
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    pathMatch: 'full',
    data: {
      title: 'New Style Metal Roofing - Privacy Policy',
      description: 'Privacy Policy',
      ogUrl: 'http://newstylemetalroofing.com/privacy-policy',
    },
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
