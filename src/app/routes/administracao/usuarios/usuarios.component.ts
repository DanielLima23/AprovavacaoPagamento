import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenService } from '@core';
import { Data } from 'app/data/data';
import { Location } from '@angular/common';


@Component({
  selector: 'app-administracao-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class AdministracaoUsuariosComponent implements OnInit {



  ngOnInit() {

  }


  textoParaCopiar: string = '';

  constructor(private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private tokenService: TokenService) {

  }



}
