import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalltranscriptComponent } from './calltranscript.component';

describe('CalltranscriptComponent', () => {
  let component: CalltranscriptComponent;
  let fixture: ComponentFixture<CalltranscriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalltranscriptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalltranscriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
