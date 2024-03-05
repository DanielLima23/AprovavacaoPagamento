import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditRateioDialogComponent } from './edit-rateio-dialog.component';

describe('DialogEditRateioDialogComponent', () => {
  let component: DialogEditRateioDialogComponent;
  let fixture: ComponentFixture<DialogEditRateioDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditRateioDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditRateioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
