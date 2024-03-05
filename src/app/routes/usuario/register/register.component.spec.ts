import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioRegisterComponent } from './register.component';

describe('UsuarioRegisterComponent', () => {
  let component: UsuarioRegisterComponent;
  let fixture: ComponentFixture<UsuarioRegisterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
