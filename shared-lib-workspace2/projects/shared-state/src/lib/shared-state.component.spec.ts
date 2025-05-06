import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedStateComponent } from './shared-state.component';

describe('SharedStateComponent', () => {
  let component: SharedStateComponent;
  let fixture: ComponentFixture<SharedStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
