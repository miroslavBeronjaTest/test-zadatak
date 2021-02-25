import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-invalid',
  templateUrl: './dialog-invalid.component.html',
  styleUrls: ['./dialog-invalid.component.scss']
})
export class DialogInvalidComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogInvalidComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
