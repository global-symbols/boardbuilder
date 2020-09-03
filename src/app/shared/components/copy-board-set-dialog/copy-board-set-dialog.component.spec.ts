import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyBoardSetDialogComponent } from './copy-board-set-dialog.component';

describe('CopyBoardSetDialogComponent', () => {
  let component: CopyBoardSetDialogComponent;
  let fixture: ComponentFixture<CopyBoardSetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyBoardSetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyBoardSetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
