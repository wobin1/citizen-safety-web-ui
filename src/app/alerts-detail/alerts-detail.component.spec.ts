import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsDetailComponent } from './alerts-detail.component';

describe('AlertsDetailComponent', () => {
  let component: AlertsDetailComponent;
  let fixture: ComponentFixture<AlertsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
