import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McpDashboard } from './mcp-dashboard';

describe('McpDashboard', () => {
  let component: McpDashboard;
  let fixture: ComponentFixture<McpDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [McpDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(McpDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
