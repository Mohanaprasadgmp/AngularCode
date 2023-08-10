import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaypopupComponent } from './holidaypopup.component';

describe('HolidaypopupComponent', () => {
  let component: HolidaypopupComponent;
  let fixture: ComponentFixture<HolidaypopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidaypopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HolidaypopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
