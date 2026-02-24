import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  snackBar = inject(MatSnackBar);

  error(message: string) {
    this.open(message, 'error');
  }

  valid(message: string) {
    this.open(message, 'valid');
  }

  info(message: string) {
    this.open(message, 'info');
  }

  warning(message: string) {
    this.open(message, 'warning');
  }

  private open(message: string, panelClass: 'error' | 'valid' | 'info' | 'warning') {
    this.snackBar.open(message, undefined, {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }
}
