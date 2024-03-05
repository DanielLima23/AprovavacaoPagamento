import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracaoAprovarUsuariosComponent } from './aprovar-usuarios.component';

describe('AdministracaoAprovarUsuariosComponent', () => {
  let component: AdministracaoAprovarUsuariosComponent;
  let fixture: ComponentFixture<AdministracaoAprovarUsuariosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministracaoAprovarUsuariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracaoAprovarUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
