import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapupMessageComponent } from './wrapup-message.component';

describe('WrapupMessageComponent', () => {
  let component: WrapupMessageComponent;
  let fixture: ComponentFixture<WrapupMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapupMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WrapupMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
