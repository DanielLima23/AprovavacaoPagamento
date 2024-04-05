import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class DialogLogoutComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<DialogLogoutComponent>) { }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close(false);
  }
  logout() {
    this.dialogRef.close(true);
  }

}
