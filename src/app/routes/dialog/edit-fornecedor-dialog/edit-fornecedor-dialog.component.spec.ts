import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditFornecedorDialogComponent } from './edit-fornecedor-dialog.component';

describe('DialogEditFornecedorDialogComponent', () => {
  let component: DialogEditFornecedorDialogComponent;
  let fixture: ComponentFixture<DialogEditFornecedorDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditFornecedorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditFornecedorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
