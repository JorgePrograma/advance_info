import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class StepConfigurationService {
  getSteps(hasSignature: boolean): any[] {
    const baseSteps = [
      {
        label: 'Información Personal',
        title: 'Datos Personales',
        subtitle: 'Por favor, completa tu información personal básica',
        formGroupName: 'basicInfo',
        component: 'app-basic-info',
      },
      {
        label: 'Información de Contacto',
        title: 'Datos de Contacto',
        subtitle: 'Proporciona tus medios de contacto principales',
        formGroupName: 'contactInfo',
        component: 'app-contact-info',
      },
    ];
    if (hasSignature) {
      baseSteps.push({
        label: 'Firma Digital',
        title: 'Configuración de Firma',
        subtitle: 'Configura los detalles de la firma digital',
        formGroupName: 'signatureInfo',
        component: 'app-signature-info',
      });
    }

    return [
      ...baseSteps,
      {
        label: 'Información de Empleado',
        title: 'Datos Laborales',
        subtitle: 'Ingresa la información relacionada con tu puesto',
        formGroupName: 'employeeInfo',
        component: 'app-employee-info',
      },
      {
        label: 'Cuenta',
        title: 'Configuración de Cuenta',
        subtitle: 'Establece tus credenciales de acceso',
        formGroupName: 'accountInfo',
        component: 'app-account-info',
      },
    ];
  }
}
