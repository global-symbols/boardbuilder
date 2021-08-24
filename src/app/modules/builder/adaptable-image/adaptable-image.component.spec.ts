import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptableImageComponent } from './adaptable-image.component';

describe('AdaptableImageComponent', () => {
  let component: AdaptableImageComponent;
  let fixture: ComponentFixture<AdaptableImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdaptableImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptableImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
