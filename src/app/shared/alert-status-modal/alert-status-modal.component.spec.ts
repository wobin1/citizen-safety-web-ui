import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertStatusModalComponent } from './alert-status-modal.component';

describe('AlertStatusModalComponent', () => {
  let component: AlertStatusModalComponent;
  let fixture: ComponentFixture<AlertStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertStatusModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
