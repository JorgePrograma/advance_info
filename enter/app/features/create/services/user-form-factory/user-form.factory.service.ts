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
        data?.person.documentNumber || '122222222',
        [Validators.required, Validators.pattern(/^\d+$/)],
      ],
      firstName: [data?.person.firstName || 'prueba', Validators.required],
      middleName: [data?.person.middleName || ''],
      lastName: [data?.person.lastName || 'marte', Validators.required],
      secondLastName: [data?.person.secondLastName || 'marte'],
    });
  }

  private createContactInfoForm(data?: CombinedUserInfo): FormGroup {
    return this.fb.group({
      country: [ 'Colombia', Validators.required],
      city: [ 'Antioquia', Validators.required],
      department: [ 'Medellin', Validators.required],
      address: [data?.contact?.address || 'sawse', Validators.required],
      email: [
        data?.contact?.email || 'contact@gmail.com',
        [Validators.required, Validators.email]
      ],
      phone: [
        data?.contact?.phone || '3121234567',
        [Validators.required, Validators.pattern(/^\d{10}$/)]
      ],
      hasSignature: [data?.signature || false]
    });
  }

  private createEmployeeInfoForm(data?: CombinedUserInfo): FormGroup {
    return this.fb.group({
      bussinesEmail: [
        data?.employee?.bussinesEmail ?? 'prueba321@gmail.com',
        [Validators.required, Validators.email]
      ],
      bussinesPhone: [
        data?.employee?.bussinesPhone || '3121234567',
        [Validators.required, Validators.pattern(/^\d{10}$/)]
      ],
      idPosition: [data?.employee?.idPosition || '', Validators.required],
      idBranch: [data?.employee?.idBranch || 'Prueba', Validators.required],
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
          data?.password || 'Prueba123===CC',
          [
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&=])[A-Za-z\d@$!%*#?&=]{8,}$/
            ),
          ],
        ],
        confirmationPassword: [data?.password || 'Prueba123===CC'],
        isDirectoryActive: [data?.isDirectoryActive || false]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  public createSignatureInfoForm(data?: any): FormGroup {
    return this.fb.group({
      SignaturePassword: [data?.SignaturePassword || ''],
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
