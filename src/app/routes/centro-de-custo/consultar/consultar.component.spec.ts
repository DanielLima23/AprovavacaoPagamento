import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroDeCustoConsultarComponent } from './consultar.component';

describe('CentroDeCustoConsultarComponent', () => {
  let component: CentroDeCustoConsultarComponent;
  let fixture: ComponentFixture<CentroDeCustoConsultarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CentroDeCustoConsultarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentroDeCustoConsultarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
