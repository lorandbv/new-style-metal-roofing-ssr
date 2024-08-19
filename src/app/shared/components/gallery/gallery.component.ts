import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Image } from '../../models/models';
import { DbService } from '../../services/db.service';
import { ImagesService } from '../../services/images.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  images: Image[] = [];
  imageGrids: Image[][] = [];

  constructor(
    public imagesService: ImagesService,
    public utils: UtilsService,
    private db: DbService,
    private toastr: ToastrService
  ) {
    effect(
      () => {
        this.images = [];
        this.imageGrids = [];

        if (this.imagesService.imagesLoaded()) {
          this.images = this.imagesService.galleryImages.sort(
            (a, b) => a.position - b.position
          );

          this.images.forEach((image, index) => {
            if (index % 5 === 0) {
              this.generateGrid(index + 1, index + 5);
            }
          });

          if (!this.images.length) {
            this.generateGrid(1, 5);
          }
        }
      },
      { allowSignalWrites: true }
    );
  }

  fileUploaded(event: any, image: Image): void {
    const file = event?.target?.files?.[0];

    if (file) {
      image.file = file;
      image.url = URL.createObjectURL(file);
    }
  }

  generateGrid(start: number, finish: number): void {
    const imagesGrid = [];

    Array.from({ length: finish - start + 1 }, (_, i) => start + i).forEach(
      (position) => {
        const imgFromDb = this.imagesService?.galleryImages?.find(
          (img) => img.position === position
        );

        imagesGrid.push({
          position,
          name: imgFromDb?.name,
          url: imgFromDb?.url,
          file: '',
          id: imgFromDb?.id,
        });
      }
    );

    this.imageGrids.push(imagesGrid);
  }

  addGrid(): void {
    this.generateGrid(
      this.imageGrids.length * 5 + 1,
      this.imageGrids.length * 5 + 5
    );
  }

  hasEmptyImages(): boolean {
    if (
      this.imageGrids[this.imageGrids.length - 1]?.some(
        (image) => !image.file && !image.url
      )
    ) {
      return true;
    }
    return false;
  }

  deleteImage(image: Image): void {
    if (image?.id) {
      this.imagesService.deleteImage(image);
    } else {
      image.file = null;
      image.url = '';
    }
  }

  saveImages(): void {
    this.imageGrids.forEach((imageGrid) => {
      imageGrid.forEach((image) => {
        if (image.file) {
          this.db.addImageToGallery(image).then((res) => {
            image.file = null;
            this.toastr.success('Image added successfully.');
          });
        }
      });
    });
  }
}
