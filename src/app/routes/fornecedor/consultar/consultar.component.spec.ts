import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FornecedorConsultarComponent } from './consultar.component';

describe('FornecedorConsultarComponent', () => {
  let component: FornecedorConsultarComponent;
  let fixture: ComponentFixture<FornecedorConsultarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FornecedorConsultarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FornecedorConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
