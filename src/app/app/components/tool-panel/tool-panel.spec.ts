import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolPanel } from './tool-panel';

describe('ToolPanel', () => {
  let component: ToolPanel;
  let fixture: ComponentFixture<ToolPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
