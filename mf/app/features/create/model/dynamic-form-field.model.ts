import { Validators } from "@angular/forms";
import { MatFormFieldAppearance } from "@angular/material/form-field";

export interface DynamicFormFieldModel {
  controlName: string;
  label: string;
  type: 'text' | 'select' | 'number' | 'email' | 'password' | 'tel';
  validators?: Validators[];
  options?: { value: any; label: string }[];
  placeholder?: string;
  appearance?: MatFormFieldAppearance;
  disabled?: boolean,
  initialValue?: any;
  onChange?: (event: any) => void;
}
