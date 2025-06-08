import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private snackBar: MatSnackBar) { }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, isError?'Erro ':'Info ', {
      duration: 3000,
      //horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: (isError) ? ['msg-error'] : ['msg-success']
    })
  }
}

