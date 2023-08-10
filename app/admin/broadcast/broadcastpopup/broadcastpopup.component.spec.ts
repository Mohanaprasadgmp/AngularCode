import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastpopupComponent } from './broadcastpopup.component';

describe('BroadcastpopupComponent', () => {
  let component: BroadcastpopupComponent;
  let fixture: ComponentFixture<BroadcastpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadcastpopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BroadcastpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
