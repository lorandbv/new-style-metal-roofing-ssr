import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyMetalInfoComponent } from './why-metal-info.component';

describe('WhyMetalInfoComponent', () => {
  let component: WhyMetalInfoComponent;
  let fixture: ComponentFixture<WhyMetalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyMetalInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyMetalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
