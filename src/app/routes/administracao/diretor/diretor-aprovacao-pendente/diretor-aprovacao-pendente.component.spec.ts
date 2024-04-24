import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared/shared.module';

import { AdministracaoDiretorDiretorAprovacaoPendenteComponent } from './diretor-aprovacao-pendente.component';

describe('AdministracaoDiretorDiretorAprovacaoPendenteComponent', () => {
  let component: AdministracaoDiretorDiretorAprovacaoPendenteComponent;
  let fixture: ComponentFixture<AdministracaoDiretorDiretorAprovacaoPendenteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdministracaoDiretorDiretorAprovacaoPendenteComponent],
      imports: [NoopAnimationsModule, SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracaoDiretorDiretorAprovacaoPendenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
