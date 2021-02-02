import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BoardPreviewSvgComponent} from './board-preview-svg.component';

describe('BoardPreviewSvgComponent', () => {
  let component: BoardPreviewSvgComponent;
  let fixture: ComponentFixture<BoardPreviewSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardPreviewSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardPreviewSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
