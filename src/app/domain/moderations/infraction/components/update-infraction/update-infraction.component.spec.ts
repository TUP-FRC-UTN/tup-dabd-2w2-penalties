import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInfractionComponent } from './update-infraction.component';

describe('UpdateInfractionComponent', () => {
  let component: UpdateInfractionComponent;
  let fixture: ComponentFixture<UpdateInfractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateInfractionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateInfractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
