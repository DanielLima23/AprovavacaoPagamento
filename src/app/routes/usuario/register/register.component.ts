import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-usuario-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class UsuarioRegisterComponent implements OnInit {

  userForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(private formBuilder: FormBuilder) { 
    
    this.userForm = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: [''],
      cnpj: [''],
      celular: ['', Validators.required],
      senha: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      contaCnpj: [false],

    }, {
      validators: this.cpfCnpjRequiredValidator
    });
  }

  ngOnInit() {
  }

  cpfCnpjRequiredValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const cpfControl = formGroup.get('cpf');
    const cnpjControl = formGroup.get('cnpj');

    if (!cpfControl || !cnpjControl) {
      return null;
    }
    const cpf = cpfControl.value;
    const cnpj = cnpjControl.value;

    if (cpf || cnpj) {
      return null;
    }
    return { 'cpfCnpjRequired': true };
  }

  salvar(){}

  limparCpfCnpj() {
    this.userForm.get('cpf')?.setValue('')
    this.userForm.get('cnpj')?.setValue('')
  }

  toggleCpfCnpj(event: MatSlideToggleChange) {
    this.userForm.get('contaCnpj')?.setValue(event.checked);
    this.limparCpfCnpj();
  }

  onSubmit(){}

}
