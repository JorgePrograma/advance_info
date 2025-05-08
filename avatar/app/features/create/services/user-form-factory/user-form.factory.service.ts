import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CombinedUserInfo } from '../../../user-list/interfaces/combine-user-info';

@Injectable({
  providedIn: 'root',
})
export class UserFormFactoryService {
  constructor(private readonly fb: FormBuilder) {}

  createRegistrationForm(userData?: any): FormGroup {
    return this.fb.group({
      basicInfo: this.createBasicInfoForm(userData?.basicInfo),
      contactInfo: this.createContactInfoForm(userData?.contactInfo),
      employeeInfo: this.createEmployeeInfoForm(userData?.employeeInfo),
      accountInfo: this.createAccountInfoForm(userData?.accountInfo),
      signatureInfo: userData?.signatureInfo ? this.createSignatureInfoForm(userData.signatureInfo) : null
    });
  }

  private createBasicInfoForm(data?: CombinedUserInfo): FormGroup {
    return this.fb.group({
      documentType: [data?.person.documentType || 'CC', Validators.required],
      documentNumber: [
        data?.person.documentNumber || '',
        [Validators.required, Validators.pattern(/^\d+$/)],
      ],
      firstName: [data?.person.firstName || '', Validators.required],
      middleName: [data?.person.middleName || ''],
      lastName: [data?.person.lastName || '', Validators.required],
      secondLastName: [data?.person.secondLastName || ''],
    });
  }

  private createContactInfoForm(data?: CombinedUserInfo): FormGroup {
    return this.fb.group({
      country: [ '', Validators.required],
      city: [ '', Validators.required],
      department: [ '', Validators.required],
      address: [data?.contact?.address || '', Validators.required],
      email: [
        data?.contact?.email || '',
        [Validators.required, Validators.email]
      ],
      phone: [
        data?.contact?.phone || '',
        [Validators.required, Validators.pattern(/^\d{10}$/)]
      ],
      hasSignature: [data?.signature || false]
    });
  }

  private createEmployeeInfoForm(data?: CombinedUserInfo): FormGroup {
    return this.fb.group({
      bussinesEmail: [
        data?.employee?.bussinesEmail || '',
        [Validators.required, Validators.email]
      ],
      bussinesPhone: [
        data?.employee?.bussinesPhone || '',
        [Validators.required, Validators.pattern(/^\d{10}$/)]
      ],
      idPosition: [data?.employee?.idPosition || '', Validators.required],
      idBranch: [data?.employee?.idBranch || '', Validators.required],
      idGroup: ['', Validators.required],
    });
  }

  private createAccountInfoForm(data?: any): FormGroup {
    return this.fb.group(
      {
        avatarPath: [data?.avatarPath || null],
        role: [data?.roles?.[0] || '', Validators.required],
        user: [data?.user || '', Validators.required],
        password: [
          data?.password || '',
          [
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&=])[A-Za-z\d@$!%*#?&=]{8,}$/
            ),
          ],
        ],
        confirmationPassword: [data?.password || ''],
        isDirectoryActive: [data?.isDirectoryActive || false]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  public createSignatureInfoForm(data?: any): FormGroup {
    return this.fb.group({
      password: [data?.password || ''],
      signatureImageMechanic: [data?.signatureImageMechanic || ''],
      signatureImageDigital: [data?.signatureImageDigital || ''],
      signatureImageRubric: [data?.signatureImageRubric || ''],
    });
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmationPassword')?.value;

    return password && confirmPassword && password === confirmPassword
      ? null
      : { passwordMismatch: true };
  }
}
