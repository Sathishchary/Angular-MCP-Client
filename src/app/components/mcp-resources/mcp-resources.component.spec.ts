import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MCPResourcesComponent } from './mcp-resources.component';
import { MCPService } from '../../services/mcp.service';
import { ConnectionState, Resource } from '../../models/mcp.types';

describe('MCPResourcesComponent', () => {
  let component: MCPResourcesComponent;
  let fixture: ComponentFixture<MCPResourcesComponent>;
  let mockMCPService: jasmine.SpyObj<MCPService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MCPService', ['readResource'], {
      connectionState: signal(ConnectionState.DISCONNECTED),
      resources: signal([])
    });
    
    await TestBed.configureTestingModule({
      imports: [MCPResourcesComponent],
      providers: [
        { provide: MCPService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MCPResourcesComponent);
    component = fixture.componentInstance;
    mockMCPService = TestBed.inject(MCPService) as jasmine.SpyObj<MCPService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect image MIME types', () => {
    expect(component.isImage('image/png')).toBe(true);
    expect(component.isImage('image/jpeg')).toBe(true);
    expect(component.isImage('text/plain')).toBe(false);
    expect(component.isImage(undefined)).toBe(false);
  });

  it('should calculate blob size', () => {
    const base64String = 'SGVsbG8gV29ybGQ='; // "Hello World" in base64
    const size = component.getBlobSize(base64String);
    
    expect(size).toBe(Math.floor(base64String.length * 0.75));
  });

  it('should read resource successfully', async () => {
    const resource: Resource = {
      uri: 'file://test.txt',
      name: 'test.txt',
      description: 'Test file'
    };
    
    const content = {
      uri: 'file://test.txt',
      mimeType: 'text/plain',
      text: 'Hello World'
    };
    
    mockMCPService.readResource.and.returnValue(Promise.resolve(content));
    
    await component.readResource(resource);
    
    expect(mockMCPService.readResource).toHaveBeenCalledWith('file://test.txt');
    expect(component.resourceContents()[resource.uri]).toEqual(content);
    expect(component.loadingResource()).toBeNull();
  });

  it('should handle resource read errors', async () => {
    const resource: Resource = {
      uri: 'file://test.txt',
      name: 'test.txt',
      description: 'Test file'
    };
    
    mockMCPService.readResource.and.returnValue(Promise.reject(new Error('Resource not found')));
    
    await component.readResource(resource);
    
    expect(component.resourceErrors()[resource.uri]).toBe('Resource not found');
    expect(component.loadingResource()).toBeNull();
  });
});