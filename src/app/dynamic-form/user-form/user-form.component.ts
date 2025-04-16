import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormDataService } from 'src/app/core/service/form-data.service';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  formData: any[] = [];

  constructor(private formDataService: FormDataService,
    public activeModal: NgbActiveModal,
        private toastr: ToastrService

  ) {}

  ngOnInit(): void {
    this.formData = this.formDataService.getFormData();
  }

  onCheckboxChange(event: any, field: any, option: string) {
    if (!field.value) {
      field.value = [];
    }
  
    if (event.target.checked) {
      field.value.push(option);
    } else {
      field.value = field.value.filter((o: string) => o !== option);
    }
  }
  

  closeModal() {
    this.activeModal.close("close with cancel button");
  }

  isFormValid(): boolean {
    return this.formData.every(formGroup => 
      formGroup.userForm.every((field: any) => {
        if (
          (field.type === 'text' || field.type === 'textarea' || field.type === 'dropdown') &&
          (!field.value || field.value.trim() === '')
        ) {
          return false;
        }
  
        if (field.type === 'radioButton' && !field.value) {
          return false;
        }
  
        if (field.type === 'checkbox' && (!Array.isArray(field.value) || field.value.length === 0)) {
          return false;
        }
  
        return true;
      })
    );
  }
  
  

  onSubmit() {
    if (!this.isFormValid()) {
      this.toastr.error('Please fill all required fields', 'Validation Error');
      return;
    }
  
    const result: any[] = [];
  
    this.formData.forEach(formGroup => {
      const groupData: any = {};
      formGroup.userForm.forEach((field: { label: string | number; value: any; }) => {
        groupData[field.label] = field.value;
      });
      result.push(groupData);
    });
    console.log('Submitted Form Data:', result);
    this.closeModal()
    this.toastr.success('User Form submitted successfully!', 'Success');
  }
  

}
