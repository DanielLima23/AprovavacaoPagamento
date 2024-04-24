import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared/shared.module';

import { AdministracaoDiretorDiretorAprovarComponent } from './diretor-aprovar.component';

describe('AdministracaoDiretorDiretorAprovarComponent', () => {
  let component: AdministracaoDiretorDiretorAprovarComponent;
  let fixture: ComponentFixture<AdministracaoDiretorDiretorAprovarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdministracaoDiretorDiretorAprovarComponent],
      imports: [NoopAnimationsModule, SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracaoDiretorDiretorAprovarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
