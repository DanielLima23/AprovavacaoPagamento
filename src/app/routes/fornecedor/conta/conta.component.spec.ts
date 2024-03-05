import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorContaComponent } from './conta.component';

describe('FornecedorContaComponent', () => {
  let component: FornecedorContaComponent;
  let fixture: ComponentFixture<FornecedorContaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FornecedorContaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FornecedorContaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
