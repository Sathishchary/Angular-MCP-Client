import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceViewer } from './resource-viewer';

describe('ResourceViewer', () => {
  let component: ResourceViewer;
  let fixture: ComponentFixture<ResourceViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
