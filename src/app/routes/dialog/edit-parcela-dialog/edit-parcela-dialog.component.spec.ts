import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditParcelaDialogComponent } from './edit-parcela-dialog.component';

describe('DialogEditParcelaDialogComponent', () => {
  let component: DialogEditParcelaDialogComponent;
  let fixture: ComponentFixture<DialogEditParcelaDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditParcelaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditParcelaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
