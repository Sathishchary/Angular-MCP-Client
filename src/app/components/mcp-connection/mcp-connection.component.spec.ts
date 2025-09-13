import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MCPConnectionComponent } from './mcp-connection.component';
import { MCPService } from '../../services/mcp.service';
import { ConnectionState } from '../../models/mcp.types';

describe('MCPConnectionComponent', () => {
  let component: MCPConnectionComponent;
  let fixture: ComponentFixture<MCPConnectionComponent>;
  let mockMCPService: jasmine.SpyObj<MCPService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MCPService', ['connect', 'initialize', 'disconnect'], {
      connectionState: signal(ConnectionState.DISCONNECTED),
      serverInfo: signal(null),
      lastError: signal(null)
    });
    
    await TestBed.configureTestingModule({
      imports: [MCPConnectionComponent],
      providers: [
        { provide: MCPService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MCPConnectionComponent);
    component = fixture.componentInstance;
    mockMCPService = TestBed.inject(MCPService) as jasmine.SpyObj<MCPService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default server URL', () => {
    expect(component.serverUrl()).toBe('ws://localhost:8080/mcp');
  });

  it('should call MCPService.connect when connect is called', async () => {
    mockMCPService.connect.and.returnValue(Promise.resolve());
    
    await component.connect();
    
    expect(mockMCPService.connect).toHaveBeenCalledWith({
      type: 'websocket',
      url: 'ws://localhost:8080/mcp'
    });
  });

  it('should call MCPService.initialize when initialize is called', async () => {
    mockMCPService.initialize.and.returnValue(Promise.resolve({
      protocolVersion: '2024-11-05',
      capabilities: {},
      serverInfo: { name: 'test', version: '1.0' }
    }));
    
    await component.initialize();
    
    expect(mockMCPService.initialize).toHaveBeenCalled();
  });

  it('should call MCPService.disconnect when disconnect is called', () => {
    component.disconnect();
    
    expect(mockMCPService.disconnect).toHaveBeenCalled();
  });
});