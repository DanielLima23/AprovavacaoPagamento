import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared/shared.module';

import { AdministracaoFinanceiroFinanceiroAprovacaoPendenteComponent } from './financeiro-aprovacao-pendente.component';

describe('AdministracaoFinanceiroFinanceiroAprovacaoPendenteComponent', () => {
  let component: AdministracaoFinanceiroFinanceiroAprovacaoPendenteComponent;
  let fixture: ComponentFixture<AdministracaoFinanceiroFinanceiroAprovacaoPendenteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdministracaoFinanceiroFinanceiroAprovacaoPendenteComponent],
      imports: [NoopAnimationsModule, SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracaoFinanceiroFinanceiroAprovacaoPendenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
