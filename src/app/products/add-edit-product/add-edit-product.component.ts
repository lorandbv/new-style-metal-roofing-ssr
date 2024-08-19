import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { AddColorComponent } from '../../shared/components/add-color/add-color.component';
import { Material, MaterialColor, Product } from '../../shared/models/models';
import { DbService } from '../../shared/services/db.service';
import { SEOService } from '../../shared/services/seo.service';
import { UtilsService } from '../../shared/services/utils.service';

@Component({
  selector: 'app-add-edit-product',
  standalone: true,
  imports: [CommonModule, AddColorComponent, FormsModule],
  templateUrl: './add-edit-product.component.html',
  styleUrl: './add-edit-product.component.scss',
})
export class AddEditProductComponent {
  @Input() set product(product: Product) {
    if (product) {
      this._product = product;
      this.productName = product.name;
      this.description = product.description;
      this.info = product.info;

      this.materials = Array.from(
        Object.keys(product.materials),
        (key) => product.materials[key]
      );

      this.materials.forEach((material) => {
        material.colors = Array.from(
          Object.keys(material.colors),
          (key) => material.colors[key]
        );
      });
      this.isEdit = true;
    }
  }

  get product(): Product {
    return this._product;
  }

  private _product: Product;
  private emptyMaterial = {
    name: '',
    colors: [{ name: '', img: '' }],
  };
  private emptyColor = { name: '', img: '' };
  private isEdit: boolean = false;

  productName: string = '';
  description: string = '';
  info: string = '';

  materials: Material[] = [_.cloneDeep(this.emptyMaterial)];
  isSaveDisabled: boolean = true;

  constructor(
    private dbService: DbService,
    private toastr: ToastrService,
    private utils: UtilsService,
    private seo: SEOService
  ) {
    this.seo.updateCanonicalUrl(
      'https://newstylemetalroofing.com/products/add'
    );
  }

  addColor(material: Material, containerId: string): void {
    material.colors = material.colors.concat(_.cloneDeep(this.emptyColor));
    setTimeout(() => {
      const container: any = document.getElementById(containerId);
      container.scrollLeft = container.scrollWidth;
      const colorElem = document.getElementById(`${containerId}-last-input`);
      (<any>colorElem).focus();
    }, 0);
  }

  addMaterial(): void {
    this.materials = this.materials.concat(_.cloneDeep(this.emptyMaterial));
  }

  addFile(color: any, file: any): void {
    color.imgFile = file;
  }

  deleteColor(material: Material, colorToRemove: MaterialColor): void {
    material.colors = material.colors.filter(
      (color) => color.name !== colorToRemove.name
    );
  }

  deleteMaterial(index: number): void {
    this.materials.splice(index, 1);
  }

  addName(color: MaterialColor, name: string): void {
    color.name = name;
  }

  saveProduct(): void {
    if (this.isEdit) {
      this.product.materials = this.materials;
      this.product.name = this.productName;
      this.product.description = this.description;
      this.product.info = this.info;
      this.dbService
        .updateProduct(this.product)
        .then(() => {
          this.toastr.success('Product updated successfully');
          this.utils.isLoading.set(false);
          this.initForm();
        })
        .catch(() => 'An error occured');
    } else {
      this.dbService
        .createProduct({
          name: this.productName,
          description: this.description,
          info: this.info,
          materials: this.materials,
        })
        .then(() => {
          this.toastr.success('Product added successfully');
          this.utils.isLoading.set(false);
          this.initForm();
        })
        .catch(() => 'An error occured');
    }
  }

  initForm(): void {
    this.productName = '';
    this.description = '';
    this.materials = [_.cloneDeep(this.emptyMaterial)];
  }

  isDuplicated(array: any[], name: string): boolean {
    if (name) {
      const isDuplicated =
        array.filter((elem) => elem.name === name)?.length > 1;
      this.isSaveDisabled = isDuplicated;
      if (isDuplicated) {
        this.toastr.warning('Please enter unique names.');
      }
      return isDuplicated;
    }
    return false;
  }

  hasIncompleteData(): boolean {
    let incompleteData: boolean = false;

    this.materials?.forEach((material) => {
      if (incompleteData) {
        return;
      }

      if (!material.name) {
        incompleteData = true;
      }

      material?.colors?.forEach((color) => {
        if (!color.name || (!color.img && !color.imgFile)) {
          incompleteData = true;
        }
      });
    });

    return incompleteData;
  }
}
