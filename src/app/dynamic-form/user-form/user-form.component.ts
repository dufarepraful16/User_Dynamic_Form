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
    console.log('Received data:', this.formData);
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

  onSubmit() {
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
