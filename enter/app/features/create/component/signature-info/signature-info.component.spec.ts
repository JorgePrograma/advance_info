import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureInfoComponent } from './signature-info.component';

describe('SignatureInfoComponent', () => {
  let component: SignatureInfoComponent;
  let fixture: ComponentFixture<SignatureInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignatureInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignatureInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
