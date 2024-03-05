import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditCentroCustoDialogComponent } from './edit-centro-custo-dialog.component';

describe('DialogEditCentroCustoDialogComponent', () => {
  let component: DialogEditCentroCustoDialogComponent;
  let fixture: ComponentFixture<DialogEditCentroCustoDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditCentroCustoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditCentroCustoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
