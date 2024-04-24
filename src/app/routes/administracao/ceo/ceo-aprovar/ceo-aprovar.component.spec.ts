import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared/shared.module';

import { AdministracaoCeoCeoAprovarComponent } from './ceo-aprovar.component';

describe('AdministracaoCeoCeoAprovarComponent', () => {
  let component: AdministracaoCeoCeoAprovarComponent;
  let fixture: ComponentFixture<AdministracaoCeoCeoAprovarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdministracaoCeoCeoAprovarComponent],
      imports: [NoopAnimationsModule, SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracaoCeoCeoAprovarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
