import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  sendNewMessageEmail(contactForm: FormGroup): Promise<any> {
    const templateParams = {
      name: contactForm.value?.name || '-',
      email: contactForm.value?.email,
      phone: contactForm.value?.phone || '-',
      message: contactForm.value?.message,
      sendTo: 'newstylemetalroofing@yahoo.com',
    };
    return emailjs
      .send(
        'service_xofg9bi',
        'template_y5hpguq',
        templateParams,
        'user_Z1anJTrO3qqaIOYiWeYfo'
      )
      .then(
        (result: EmailJSResponseStatus) => {
          console.log(result.text);
        },
        (error: any) => {
          console.log(error.text);
        }
      );
  }
}
