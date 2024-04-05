import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenService } from '@core';

@Component({
  selector: 'app-administracao-convidar',
  templateUrl: './convidar.component.html',
  styleUrls: ['./convidar.component.scss']
})
export class AdministracaoConvidarComponent implements OnInit {
  userForm: FormGroup;
  urlRegister: string = "auth/register/" + this.tokenService.getTokenCliente();

  enderecoBase!: string;

  ngOnInit() {
    this.userForm = this.formBuilder.group({ // Crie um FormGroup aqui
      linkRegister: ['']
    });
    this.enderecoBase = `${window.location.protocol}//${window.location.host}/`;

    this.userForm.get('linkRegister')?.disable();
    this.textoParaCopiar = this.enderecoBase + this.urlRegister;
    this.userForm.get('linkRegister')?.setValue(this.textoParaCopiar)
  }


  textoParaCopiar: string = '';

  constructor(private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private tokenService: TokenService) {
    this.userForm = this.formBuilder.group({
      linkRegister: ['']
    })

  }

  copiarTexto() {
    navigator.clipboard.writeText(this.textoParaCopiar).then(() => {
      this._snackBar.open('Texto copiado para a área de transferência', 'Fechar', {
        duration: 2000,
      });
    }, (err) => {
      console.error('Erro ao copiar texto: ', err);
      this._snackBar.open('Erro ao copiar texto', 'Fechar', {
        duration: 2000,
      });
    });
  }

}
