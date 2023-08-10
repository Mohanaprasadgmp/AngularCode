import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalltranscriptpopupComponent } from './calltranscriptpopup.component';

describe('CalltranscriptpopupComponent', () => {
  let component: CalltranscriptpopupComponent;
  let fixture: ComponentFixture<CalltranscriptpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalltranscriptpopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalltranscriptpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
