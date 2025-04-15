import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormDataService {
  private storedData: any[] = [];

  saveFormData(data: any) {
    this.storedData.push(data);
    console.log('Data saved:', data);
  }

  getFormData() {
    return this.storedData;
  }
} 
