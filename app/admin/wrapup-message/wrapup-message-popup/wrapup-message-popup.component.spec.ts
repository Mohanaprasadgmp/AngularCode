import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapupMessagePopupComponent } from './wrapup-message-popup.component';

describe('WrapupMessagePopupComponent', () => {
  let component: WrapupMessagePopupComponent;
  let fixture: ComponentFixture<WrapupMessagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapupMessagePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WrapupMessagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
