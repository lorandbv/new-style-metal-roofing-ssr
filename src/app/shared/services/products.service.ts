import { Injectable, WritableSignal, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../models/models';
import { DbService } from './db.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  products: Product[] = [];
  productsLoaded: WritableSignal<boolean> = signal(false);

  constructor(
    private dbService: DbService,
    private utils: UtilsService,
    private toastr: ToastrService
  ) {}

  async getProducts() {
    this.products = await this.dbService.getProducts();
    this.utils.isLoading.set(false);
    this.productsLoaded.set(true);
  }

  deleteProduct(event: any, id: string): void {
    this.utils.isLoading.set(true);
    event?.preventDefault();
    event?.stopPropagation();

    this.dbService
      .deleteProduct(id)
      .then(() => {
        this.toastr.success('The product was deleted successfully.');
        this.getProducts();
      })
      .catch(() => {
        this.toastr.error('An error occured.');
      });
  }
}
