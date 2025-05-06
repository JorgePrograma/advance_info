// user-form-factory.service.ts
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserFormFactoryService {
  constructor(private readonly fb: FormBuilder) {}

  createRegistrationForm(): FormGroup {
    return this.fb.group({
      basicInfo: this.createBasicInfoForm(),
      contactInfo: this.createContactInfoForm(),
      employeeInfo: this.createEmployeeInfoForm(),
      accountInfo: this.createAccountInfoForm()
    });
  }

  private createBasicInfoForm(): FormGroup {
    return this.fb.group({
      documentType: ['CC', Validators.required],
      documentNumber: ['1234567890', [Validators.required, Validators.pattern(/^\d+$/)]],
      firstName: ['jorge', Validators.required],
      middleName: ['eliecer'],
      lastName: ['martelo', Validators.required],
      secondLastName: ['suarez']
    });
  }

  private createContactInfoForm(): FormGroup {
    return this.fb.group({
      country: ['colombia', Validators.required],
      city: ['monteria', Validators.required],
      department: ['momil', Validators.required],
      address: ['momil', Validators.required],
      email: ['jemartelo07@gmail.com', [Validators.required, Validators.email]],
      phone: ['3127597560', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      hasSignature: [false]
    });
  }

  private createEmployeeInfoForm(): FormGroup {
    return this.fb.group({
      bussinesEmail: ['jorge@corporativo.com', [Validators.required, Validators.email]],
      bussinesPhone: ['3127597560', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      idPosition: ['desarrollador', Validators.required],
      idBranch: ['CC', Validators.required],
      idGroup: ['CC', Validators.required]
    });
  }

  private createAccountInfoForm(): FormGroup {
    return this.fb.group({
      avatarPath: [''],
      role: ["cc", Validators.required],
      user: ['pruebw', Validators.required],
      password: ['*Jorge1997=', [
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&=])[A-Za-z\d@$!%*#?&=]{8,}$/)
      ]],
      confirmationPassword: ['*Jorge1997=']
    }, { validators: this.passwordMatchValidator });
  }

  public createSignatureInfoForm(): FormGroup {
    return this.fb.group({
      passsword: [''],
      signatureImageMechanic: [''],
      signatureImageDigital: [''],
      signatureImageRubric: ['']
    });
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
    return form.get('password')?.value === form.get('confirmationPassword')?.value ?
      null : { passwordMismatch: true };
  }
}
