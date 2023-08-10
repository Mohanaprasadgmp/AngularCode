import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallControlPanelComponent } from './call-control-panel.component';

describe('CallControlPanelComponent', () => {
  let component: CallControlPanelComponent;
  let fixture: ComponentFixture<CallControlPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallControlPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
