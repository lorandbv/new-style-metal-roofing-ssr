import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { EmailService } from '../shared/services/email.service';
import { SEOService } from '../shared/services/seo.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private toastr: ToastrService,
    private seo: SEOService,
    private meta: Meta,
    private title: Title
  ) {
    this.contactForm = this.fb.group({
      name: new FormControl(''),
      email: new FormControl('', [Validators.email, Validators.required]),
      phone: new FormControl(''),
      message: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
    });

    this.seo.updateCanonicalUrl('https://newstylemetalroofing.com/contact');
    this.meta.addTags([
      {
        name: 'keywords',
        content:
          'Contact form, New Style Metal Roofing LLC, 4400B Lincoln Way East Massillon OH 44646, newstylemetalroofing@yahoo.com',
      },
      { name: 'robots', content: 'index, follow' },
      {
        name: 'description',
        content:
          'Contact form, New Style Metal Roofing LLC, 4400B Lincoln Way East Massillon OH 44646, newstylemetalroofing@yahoo.com',
      },
      {
        property: 'og:description',
        content:
          'Contact form, New Style Metal Roofing LLC, 4400B Lincoln Way East Massillon OH 44646, newstylemetalroofing@yahoo.com',
      },
      { property: 'og:title', content: 'New Style Metal Roofing - Contact' },
      { property: 'og:type', content: 'website' },
      {
        property: 'og:url',
        content: 'https://newstylemetalroofing.com/contact',
      },
      { rel: 'canonical', href: 'https://newstylemetalroofing.com/contact' },
    ]);
    this.title.setTitle('New Style Metal Roofing - Contact');
  }

  submitContactForm(): void {
    this.emailService
      .sendNewMessageEmail(this.contactForm)
      .then(() => {
        this.contactForm = this.fb.group({
          name: new FormControl('', [
            Validators.required,
            Validators.minLength(3),
          ]),
          email: new FormControl('', [Validators.email, Validators.required]),
          phone: new FormControl('', [Validators.required]),
          message: new FormControl('', [
            Validators.required,
            Validators.minLength(10),
          ]),
        });
        this.toastr.success('Message sent successfully.');
      })
      .catch(() => {
        this.toastr.error('An error occured.');
      });
  }
}
