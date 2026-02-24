import { Component, inject } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { SessionService } from '../../services/session';
import { NotificationService } from '../../services/notification';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-session',
  imports: [MatCardModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-session.html',
  styleUrl: './create-session.scss',
})
export class CreateSession {
  formBuilder = inject(NonNullableFormBuilder);
  sessionService = inject(SessionService);
  notification = inject(NotificationService);
  router = inject(Router);

  form = this.formBuilder.group({
    nom: ['', [Validators.required, Validators.minLength(3)]],
  });

  onSubmit() {
  if (this.form.valid) {
    const nomSaisi = this.form.getRawValue().nom;

    this.sessionService.createSession(nomSaisi).subscribe({
      next: () => {
        this.notification.valid(`La session "${nomSaisi}" a été créée avec succès !`);
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        if (err.status === 409) {
          this.notification.warning('Ce nom de session est déjà utilisé');
        } else {
          this.notification.error('Erreur lors de la création de la session');
        }
      },
    });
  }
}
}
