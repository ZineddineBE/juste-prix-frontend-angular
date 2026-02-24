import { Component, inject } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Authentification } from '../../services/authentification';
import { NotificationService } from '../../services/notification';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  formBuilder = inject(NonNullableFormBuilder);
  authentification = inject(Authentification);
  notification = inject(NotificationService);
  router = inject(Router);

  form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  onSubmit() {
    if (this.form.valid) {
      this.authentification.login(this.form.getRawValue()).subscribe({
        next: () => {
          this.notification.valid('Bienvenue ' + this.form.getRawValue().email);
          this.router.navigateByUrl('/home');
        },
        error: () => {
          this.notification.error('Mauvais email ou mot de passe');
        },
      });
    }
  }
}
