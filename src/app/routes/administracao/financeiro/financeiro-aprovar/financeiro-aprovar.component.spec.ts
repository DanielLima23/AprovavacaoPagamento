import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared/shared.module';

import { AdministracaoFinanceiroFinanceiroAprovarComponent } from './financeiro-aprovar.component';

describe('AdministracaoFinanceiroFinanceiroAprovarComponent', () => {
  let component: AdministracaoFinanceiroFinanceiroAprovarComponent;
  let fixture: ComponentFixture<AdministracaoFinanceiroFinanceiroAprovarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdministracaoFinanceiroFinanceiroAprovarComponent],
      imports: [NoopAnimationsModule, SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracaoFinanceiroFinanceiroAprovarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
