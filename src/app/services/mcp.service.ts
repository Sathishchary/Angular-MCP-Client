import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject, filter, map, take, timeout } from 'rxjs';
import {
  MCPMessage,
  MCPRequest,
  MCPResponse,
  MCPNotification,
  ConnectionState,
  TransportConfig,
  InitializeRequest,
  InitializeResponse,
  Tool,
  ToolCallRequest,
  ToolCallResponse,
  Resource,
  Prompt,
  ClientInfo,
  ClientCapabilities
} from '../models/mcp.types';

@Injectable({
  providedIn: 'root'
})
export class MCPService {
  private ws: WebSocket | null = null;
  private messageId = 0;
  private pendingRequests = new Map<string | number, Subject<MCPResponse>>();
  private messageSubject = new Subject<MCPMessage>();
  
  // Reactive state
  public connectionState = signal<ConnectionState>(ConnectionState.DISCONNECTED);
  public isConnected = signal<boolean>(false);
  public serverInfo = signal<any>(null);
  public tools = signal<Tool[]>([]);
  public resources = signal<Resource[]>([]);
  public prompts = signal<Prompt[]>([]);
  public lastError = signal<string | null>(null);

  // Observables for notifications
  public notifications$ = this.messageSubject.pipe(
    filter((msg): msg is MCPNotification => !('id' in msg) && 'method' in msg)
  );

  constructor() {
    // Listen for tool/resource/prompt list changes
    this.notifications$.pipe(
      filter(notification => 
        notification.method === 'notifications/tools/list_changed' ||
        notification.method === 'notifications/resources/list_changed' ||
        notification.method === 'notifications/prompts/list_changed'
      )
    ).subscribe(notification => {
      this.handleListChangeNotification(notification);
    });
  }

  /**
   * Connect to MCP server via WebSocket
   */
  async connect(config: TransportConfig): Promise<void> {
    if (this.connectionState() !== ConnectionState.DISCONNECTED) {
      throw new Error('Already connected or connecting');
    }

    this.connectionState.set(ConnectionState.CONNECTING);
    this.lastError.set(null);

    try {
      if (config.type === 'websocket' && config.url) {
        await this.connectWebSocket(config.url);
      } else {
        throw new Error('Only WebSocket transport is currently supported');
      }
    } catch (error) {
      this.connectionState.set(ConnectionState.ERROR);
      this.lastError.set(error instanceof Error ? error.message : 'Connection failed');
      throw error;
    }
  }

  /**
   * Initialize MCP session
   */
  async initialize(): Promise<InitializeResponse> {
    if (this.connectionState() !== ConnectionState.CONNECTED) {
      throw new Error('Must be connected before initializing');
    }

    const clientInfo: ClientInfo = {
      name: 'Angular MCP Client',
      version: '1.0.0'
    };

    const capabilities: ClientCapabilities = {
      roots: {
        listChanged: true
      },
      sampling: {}
    };

    const request: InitializeRequest = {
      protocolVersion: '2024-11-05',
      capabilities,
      clientInfo
    };

    try {
      const response = await this.sendRequest('initialize', request);
      this.serverInfo.set(response.serverInfo);
      this.connectionState.set(ConnectionState.INITIALIZED);
      
      // Load initial lists
      await this.refreshLists();
      
      return response;
    } catch (error) {
      this.connectionState.set(ConnectionState.ERROR);
      this.lastError.set(error instanceof Error ? error.message : 'Initialization failed');
      throw error;
    }
  }

  /**
   * Disconnect from MCP server
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connectionState.set(ConnectionState.DISCONNECTED);
    this.isConnected.set(false);
    this.serverInfo.set(null);
    this.tools.set([]);
    this.resources.set([]);
    this.prompts.set([]);
    this.pendingRequests.clear();
  }

  /**
   * Send a request and wait for response
   */
  async sendRequest(method: string, params?: any): Promise<any> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('Not connected to server');
    }

    const id = ++this.messageId;
    const request: MCPRequest = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };

    const responseSubject = new Subject<MCPResponse>();
    this.pendingRequests.set(id, responseSubject);

    this.ws.send(JSON.stringify(request));

    return responseSubject.pipe(
      take(1),
      timeout(30000), // 30 second timeout
      map(response => {
        if (response.error) {
          throw new Error(`MCP Error ${response.error.code}: ${response.error.message}`);
        }
        return response.result;
      })
    ).toPromise();
  }

  /**
   * Call a tool
   */
  async callTool(name: string, args?: any): Promise<ToolCallResponse> {
    const request: ToolCallRequest = {
      name,
      arguments: args
    };

    return this.sendRequest('tools/call', request);
  }

  /**
   * Get list of available tools
   */
  async listTools(): Promise<Tool[]> {
    const response = await this.sendRequest('tools/list');
    const tools = response.tools || [];
    this.tools.set(tools);
    return tools;
  }

  /**
   * Get list of available resources
   */
  async listResources(): Promise<Resource[]> {
    const response = await this.sendRequest('resources/list');
    const resources = response.resources || [];
    this.resources.set(resources);
    return resources;
  }

  /**
   * Get list of available prompts
   */
  async listPrompts(): Promise<Prompt[]> {
    const response = await this.sendRequest('prompts/list');
    const prompts = response.prompts || [];
    this.prompts.set(prompts);
    return prompts;
  }

  /**
   * Read a resource
   */
  async readResource(uri: string): Promise<any> {
    return this.sendRequest('resources/read', { uri });
  }

  /**
   * Get a prompt
   */
  async getPrompt(name: string, args?: any): Promise<any> {
    return this.sendRequest('prompts/get', { name, arguments: args });
  }

  private async connectWebSocket(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.connectionState.set(ConnectionState.CONNECTED);
        this.isConnected.set(true);
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: MCPMessage = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      };

      this.ws.onclose = () => {
        this.connectionState.set(ConnectionState.DISCONNECTED);
        this.isConnected.set(false);
        this.pendingRequests.clear();
      };

      this.ws.onerror = (error) => {
        this.connectionState.set(ConnectionState.ERROR);
        this.lastError.set('WebSocket connection error');
        reject(new Error('WebSocket connection failed'));
      };
    });
  }

  private handleMessage(message: MCPMessage): void {
    this.messageSubject.next(message);

    if ('id' in message && message.id !== undefined) {
      // This is a response
      const response = message as MCPResponse;
      const pending = this.pendingRequests.get(response.id!);
      if (pending) {
        pending.next(response);
        pending.complete();
        this.pendingRequests.delete(response.id!);
      }
    }
    // Notifications are handled through the notifications$ observable
  }

  private async handleListChangeNotification(notification: MCPNotification): Promise<void> {
    try {
      switch (notification.method) {
        case 'notifications/tools/list_changed':
          await this.listTools();
          break;
        case 'notifications/resources/list_changed':
          await this.listResources();
          break;
        case 'notifications/prompts/list_changed':
          await this.listPrompts();
          break;
      }
    } catch (error) {
      console.error('Failed to refresh list after change notification:', error);
    }
  }

  private async refreshLists(): Promise<void> {
    try {
      await Promise.all([
        this.listTools(),
        this.listResources(),
        this.listPrompts()
      ]);
    } catch (error) {
      console.error('Failed to refresh lists:', error);
    }
  }
}