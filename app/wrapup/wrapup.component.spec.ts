import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapupComponent } from './wrapup.component';

describe('WrapupComponent', () => {
  let component: WrapupComponent;
  let fixture: ComponentFixture<WrapupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WrapupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
