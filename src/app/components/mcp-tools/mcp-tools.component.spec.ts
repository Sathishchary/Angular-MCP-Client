import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { MCPToolsComponent } from './mcp-tools.component';
import { MCPService } from '../../services/mcp.service';
import { ConnectionState, Tool } from '../../models/mcp.types';

describe('MCPToolsComponent', () => {
  let component: MCPToolsComponent;
  let fixture: ComponentFixture<MCPToolsComponent>;
  let mockMCPService: jasmine.SpyObj<MCPService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MCPService', ['callTool'], {
      connectionState: signal(ConnectionState.DISCONNECTED),
      tools: signal([])
    });
    
    await TestBed.configureTestingModule({
      imports: [MCPToolsComponent],
      providers: [
        { provide: MCPService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MCPToolsComponent);
    component = fixture.componentInstance;
    mockMCPService = TestBed.inject(MCPService) as jasmine.SpyObj<MCPService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format schema as JSON', () => {
    const schema = { type: 'object', properties: { name: { type: 'string' } } };
    const formatted = component.formatSchema(schema);
    
    expect(formatted).toBe(JSON.stringify(schema, null, 2));
  });

  it('should detect if tool is executing', () => {
    component.executingTool.set('test-tool');
    expect(component.isToolExecuting()).toBe(true);
    
    component.executingTool.set(null);
    expect(component.isToolExecuting()).toBe(false);
  });

  it('should call tool with arguments', async () => {
    const tool: Tool = {
      name: 'test-tool',
      description: 'Test tool',
      inputSchema: {}
    };
    
    const result = {
      content: [{ type: 'text' as const, text: 'Success' }],
      isError: false
    };
    
    mockMCPService.callTool.and.returnValue(Promise.resolve(result));
    component.toolArguments.set({ 'test-tool': '{"param": "value"}' });
    
    await component.callTool(tool);
    
    expect(mockMCPService.callTool).toHaveBeenCalledWith('test-tool', { param: 'value' });
    expect(component.toolResults()['test-tool']).toEqual(result);
    expect(component.executingTool()).toBeNull();
  });

  it('should handle tool call errors', async () => {
    const tool: Tool = {
      name: 'test-tool',
      description: 'Test tool',
      inputSchema: {}
    };
    
    mockMCPService.callTool.and.returnValue(Promise.reject(new Error('Tool failed')));
    
    await component.callTool(tool);
    
    expect(component.toolResults()['test-tool'].isError).toBe(true);
    expect(component.toolResults()['test-tool'].content[0].text).toBe('Tool failed');
    expect(component.executingTool()).toBeNull();
  });
});