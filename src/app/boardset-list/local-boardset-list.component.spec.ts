import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalBoardsetListComponent } from './local-boardset-list.component';

describe('BoardsetListComponent', () => {
  let component: LocalBoardsetListComponent;
  let fixture: ComponentFixture<LocalBoardsetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalBoardsetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalBoardsetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
