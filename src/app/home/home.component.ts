import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ContactComponent } from '../contact/contact.component';
import { GalleryComponent } from '../shared/components/gallery/gallery.component';
import { WhyMetalInfoComponent } from '../shared/components/why-metal-info/why-metal-info.component';
import { DbService } from '../shared/services/db.service';
import { ImagesService } from '../shared/services/images.service';
import { SEOService } from '../shared/services/seo.service';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    GalleryComponent,
    ContactComponent,
    WhyMetalInfoComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  file: any;
  title: string = '';
  subtitle: string = '';

  constructor(
    public utils: UtilsService,
    public imagesService: ImagesService,
    private db: DbService,
    private toastr: ToastrService,
    private seo: SEOService,
    private meta: Meta,
    private titleSeo: Title
  ) {
    this.db.getHomepageInfo().then((homepageInfo) => {
      this.title = homepageInfo?.title;
      this.subtitle = homepageInfo?.subtitle;
    });
    this.seo.updateCanonicalUrl('https://newstylemetalroofing.com/');

    this.meta.addTags([
      {
        name: 'keywords',
        content:
          'metal roofing, construction materials, metal roofing ohio, metal roofing ohio, ohio construction materials, ohio metal roofing, new style metal roofing, newstylemetalroofing, ohio tiles, ohio color range tiles, color range tiles, ohio bilka',
      },
      { name: 'robots', content: 'index, follow' },
      {
        name: 'description',
        content:
          'Locally owned and operated in NE Ohio, we take pride in our quality work and the quality of materials that we install. We provide metal tile roofing, standing seam roofing, gutters, and metal fencing. We only use the heavier 25 gauge in the materials installed. What sets us apart? We buy straight from the manufacturer, use a local crew to install at unbeatable prices, which are better than shingles most of the time, and offer higher quality and warranty.',
      },
      {
        property: 'og:description',
        content:
          'Locally owned and operated in NE Ohio, we take pride in our quality work and the quality of materials that we install. We provide metal tile roofing, standing seam roofing, gutters, and metal fencing. We only use the heavier 25 gauge in the materials installed. What sets us apart? We buy straight from the manufacturer, use a local crew to install at unbeatable prices, which are better than shingles most of the time, and offer higher quality and warranty.',
      },
      { property: 'og:title', content: 'New Style Metal Roofing - Home' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://newstylemetalroofing.com/' },
    ]);
    this.titleSeo.setTitle('New Style Metal Roofing - Home');
  }

  fileUploaded(event: any): void {
    const files = event?.target?.files;

    Promise.all(
      Object.values(files)?.map((file: any) =>
        this.db.uploadImage(file, 'gallery', file?.name)
      )
    )
      .then(() => {
        this.toastr.success('Images uploaded successfully.');
        this.imagesService.getImages();
      })
      .catch((err) => {
        this.toastr.error('An error occured.');
      });
  }

  save(): void {
    this.db
      .updateTitleAndSubtitle(this.title, this.subtitle)
      .then(() => {
        this.toastr.success('Info updated successfully.');
      })
      .catch((err) => {
        this.toastr.error('An error occured.');
      });
  }
}
