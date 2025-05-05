// src/app/config/steps.config.ts

// 1. (Opcional pero recomendado) Define la interfaz para un paso
export interface StepConfig {
  label: string;
  title: string;
  subtitle: string;
  formGroupName: string;
  component: string; // Puedes usar un tipo más específico si tienes referencias a los componentes
}

// 2. Define y exporta el array de pasos, usando la interfaz
export const WIZARD_STEPS: StepConfig[] = [
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
