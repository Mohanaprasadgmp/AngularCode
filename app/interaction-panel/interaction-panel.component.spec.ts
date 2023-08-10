import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionPanelComponent } from './interaction-panel.component';

describe('InteractionPanelComponent', () => {
  let component: InteractionPanelComponent;
  let fixture: ComponentFixture<InteractionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractionPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
