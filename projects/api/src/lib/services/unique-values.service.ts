import { inject } from '@angular/core';
import { TAILORMAP_API_V1_SERVICE } from '../services';
import { UniqueValuesResponseModel } from '../models/unique-values-response.model';
import { Observable, of, tap } from 'rxjs';

interface UniqueValueParams {
  applicationId: number;
  layerId: number;
  attribute: string;
  filter?: string;
}

export class UniqueValuesService {

  private currentApplicationId: number;
  private apiService = inject(TAILORMAP_API_V1_SERVICE);

  private cachedResponses: Map<string, UniqueValuesResponseModel> = new Map();

  public getUniqueValues$(params: UniqueValueParams): Observable<UniqueValuesResponseModel> {
    if (this.currentApplicationId !== params.applicationId) {
      // Clear the cache if we change applications
      this.cachedResponses = new Map();
    }
    this.currentApplicationId = params.applicationId;
    const key = this.createKey(params);
    if (this.cachedResponses.has(key)) {
      return of(this.cachedResponses.get(key));
    }
    return this.apiService.getUniqueValues$(params)
      .pipe(tap(response => this.cachedResponses.set(key, response)));
  }

  private createKey(params: UniqueValueParams): string {
    const key = [ params.applicationId, params.layerId, params.attribute ];
    if (params.filter) {
      key.push(params.filter);
    }
    return key.join('-');
  }

}