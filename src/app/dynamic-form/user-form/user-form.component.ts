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
    if (!Array.isArray(field.value)) {
      field.value = [];
    }
  
    if (event.target.checked) {
      field.value.push(option);
    } else {
      field.value = field.value.filter((val: string) => val !== option);
    }
  }

  closeModal() {
    this.activeModal.close("close with cancel button");
  }

  isFormValid(): boolean {
    return this.formData.every(group =>
      group.userForm.every((field: { type: string; value: string | any[] | null | undefined; }) => {
        if (field.type === 'checkbox') {
          return Array.isArray(field.value) && field.value.length > 0;
        } else if (field.type === 'radioButton' || field.type === 'dropdown') {
          return field.value !== undefined && field.value !== null && field.value !== '';
        } else {
          return field.value !== undefined && field.value !== null && field.value.toString().trim() !== '';
        }
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
  
    this.closeModal();
    this.toastr.success('Form submitted successfully!', 'Success');
  }
  
  

}
