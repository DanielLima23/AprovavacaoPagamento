import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared/shared.module';

import { AdministracaoCeoCeoAprovacaoPendenteComponent } from './ceo-aprovacao-pendente.component';

describe('AdministracaoCeoCeoAprovacaoPendenteComponent', () => {
  let component: AdministracaoCeoCeoAprovacaoPendenteComponent;
  let fixture: ComponentFixture<AdministracaoCeoCeoAprovacaoPendenteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdministracaoCeoCeoAprovacaoPendenteComponent],
      imports: [NoopAnimationsModule, SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracaoCeoCeoAprovacaoPendenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
