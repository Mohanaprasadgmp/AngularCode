import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsgComponent } from './bookingsg.component';

describe('BookingsgComponent', () => {
  let component: BookingsgComponent;
  let fixture: ComponentFixture<BookingsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingsgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
