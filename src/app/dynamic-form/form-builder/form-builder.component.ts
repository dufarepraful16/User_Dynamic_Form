import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { getValidationEventArray } from 'src/app/core/helpers/constants.helpers';
import { FormDataService } from 'src/app/core/service/form-data.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.css']
})
export class FormBuilderComponent implements OnInit {
  typeOptions = ["text", "textarea", "dropdown","checkbox","radioButton"];
  validationEvent = getValidationEventArray();
  submitted: boolean = false;
  modalControl: any = null;


  dynamicForm = new FormGroup({
    userForm: new FormArray<FormGroup<any>>([]),
  });
  
  

  get form() {
    return this.dynamicForm.controls;
  }

  get userForm(): FormArray<FormGroup<any>> {
    return this.dynamicForm.get('userForm') as FormArray<FormGroup<any>>;
  }

  isFormInvalid(): boolean {
    return this.userForm.controls.every(control => control.invalid || !control.touched);
  }


  constructor(
    private formBuilder: FormBuilder,
    private formDataService: FormDataService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  addEventForm() {
    const userForm = this.formBuilder.group({
      label: new FormControl<string | null>(''),
      name: new FormControl<string | null>(''),
      type: new FormControl<string | null>(''),
      value: new FormControl<string | null>(''),
      options: new FormControl([]),
      placeholder: new FormControl<string | null>(''),
      validations: new FormControl<string | null>(''),
    });
      this.userForm.push(userForm);
      console.log('Adding form field...');
  }


  disableFormControls(index: number) {
    this.userForm.at(index).disable();
  }

  enableFormControls(index: number) {
    this.userForm.at(index).enable();
  }

  updateValidations(i:any) {
    const typeControl = this.userForm.controls[i].get("type");
    const optionsControl = this.userForm.controls[i].get("options");
    optionsControl?.clearValidators();
    if (typeControl?.value === "dropdown" || typeControl?.value === "radioButton" || typeControl?.value === "checkbox") {
      optionsControl?.setValidators([Validators.required]);
    }
    optionsControl?.updateValueAndValidity();
  }

  deleteEventForm(item: AbstractControl, index: number) {
    if (!item || !(item instanceof FormGroup)) {
      (this.dynamicForm.get("userForm") as FormArray).removeAt(index);
      return;
    }
    const idControl = item.get("id");
    if (!idControl || !idControl.value) {
      (this.dynamicForm.get("userForm") as FormArray).removeAt(index);
      return;
    }
    item.get("status")?.setValue('deleted');
  }

  onSubmit() {
    let formData = this.dynamicForm.value;
    if (formData.userForm) {
      formData.userForm = formData.userForm.map((field) => {
        field.name = field.label
          ?.replace(/[^a-zA-Z0-9]/g, " ")
          ?.split(" ")
          .map((word: string, index: number) =>
            index === 0
              ? word.toLowerCase()
              : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join("");
    
        if (field.type === "dropdown" || field.type === "radioButton" || field.type === "checkbox" ) {
          field.options = field.options.split(",").map((opt: string) => opt.trim());
        } else {
          field.options = [];
        }
    
        return field;
      });
    }
    
    if (this.dynamicForm.valid) {
      this.formDataService.clearFormData();
      this.formDataService.saveFormData(this.dynamicForm.value);
      this.submitted = true;
      this.openUserFormModal();
      this.toastr.success('User Dynamic Form submitted successfully!', 'Success');
    }
  }

  async openUserFormModal() {
    if (this.modalControl) {
      return;
    }
    const modalRef = this.modalService.open(UserFormComponent, {
      centered: true,
      size: "md",
      backdrop: "static",
      keyboard: false,
    });
  
    modalRef.closed.subscribe(() => {
      this.dynamicForm.reset();
    });
  }
  

}
