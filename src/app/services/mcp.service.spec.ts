import { TestBed } from '@angular/core/testing';
import { MCPService } from './mcp.service';
import { ConnectionState } from '../models/mcp.types';

describe('MCPService', () => {
  let service: MCPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MCPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with disconnected state', () => {
    expect(service.connectionState()).toBe(ConnectionState.DISCONNECTED);
    expect(service.isConnected()).toBe(false);
    expect(service.serverInfo()).toBeNull();
    expect(service.tools()).toEqual([]);
    expect(service.resources()).toEqual([]);
    expect(service.prompts()).toEqual([]);
    expect(service.lastError()).toBeNull();
  });

  it('should reject connection attempt when already connected', async () => {
    // Manually set state to simulate connection
    service.connectionState.set(ConnectionState.CONNECTED);
    
    await expectAsync(service.connect({ type: 'websocket', url: 'ws://test' }))
      .toBeRejectedWithError('Already connected or connecting');
  });

  it('should reject initialization when not connected', async () => {
    await expectAsync(service.initialize())
      .toBeRejectedWithError('Must be connected before initializing');
  });

  it('should reject sendRequest when not connected', async () => {
    await expectAsync(service.sendRequest('test'))
      .toBeRejectedWithError('Not connected to server');
  });

  it('should reset state on disconnect', () => {
    // Set some state
    service.connectionState.set(ConnectionState.CONNECTED);
    service.isConnected.set(true);
    service.serverInfo.set({ name: 'test', version: '1.0' });
    service.tools.set([{ name: 'test', inputSchema: {} }]);
    
    service.disconnect();
    
    expect(service.connectionState()).toBe(ConnectionState.DISCONNECTED);
    expect(service.isConnected()).toBe(false);
    expect(service.serverInfo()).toBeNull();
    expect(service.tools()).toEqual([]);
    expect(service.resources()).toEqual([]);
    expect(service.prompts()).toEqual([]);
  });
});