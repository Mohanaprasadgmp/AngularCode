import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInformationPopupComponent } from './customer-information-popup.component';

describe('CustomerInformationPopupComponent', () => {
  let component: CustomerInformationPopupComponent;
  let fixture: ComponentFixture<CustomerInformationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerInformationPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerInformationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
