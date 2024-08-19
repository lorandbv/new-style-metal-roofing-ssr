import { Injectable, signal, WritableSignal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Image } from '../models/models';
import { DbService } from './db.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  galleryImages: Image[] = [];
  imagesLoaded: WritableSignal<boolean> = signal(false);

  constructor(
    private utils: UtilsService,
    private db: DbService,
    private toastr: ToastrService
  ) {}

  getImages(): void {
    this.imagesLoaded.set(false);
    this.utils.isLoading.set(true);
    this.db.getGalleryImages().then((imgs) => {
      this.galleryImages = imgs;
      this.imagesLoaded.set(true);
      this.utils.isLoading.set(false);
    });
  }

  deleteImage(image: Image): void {
    this.db.delete('gallery', image.id).then();
    this.db
      .deleteImage('gallery', `${image.id}_${image.name}`)
      .then(() => {
        this.toastr.success('Image deleted successfully.');
        this.getImages();
      })
      .catch(() => {
        this.toastr.error('An error occured.');
        this.getImages();
      });
  }
}
