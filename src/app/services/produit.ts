import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  http = inject(HttpClient);

  getProduits() {
    // L'intercepteur JWT s'occupera d'ajouter le token automatiquement !
    return this.http.get<Produit[]>(environment.urlServer + '/produits');
  }
}
