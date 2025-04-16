import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormDataService {
  private storedData: any[] = [];

  saveFormData(data: any) {
    this.storedData.push(data);
  }
  clearFormData() {
    this.storedData=[];
    return;
  }

  getFormData() {
    return this.storedData;
  }
} 
