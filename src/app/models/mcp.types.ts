// MCP (Model Context Protocol) Type Definitions

export interface MCPMessage {
  jsonrpc: '2.0';
  id?: string | number;
}

export interface MCPRequest extends MCPMessage {
  method: string;
  params?: any;
}

export interface MCPResponse extends MCPMessage {
  result?: any;
  error?: MCPError;
}

export interface MCPNotification extends MCPMessage {
  method: string;
  params?: any;
}

export interface MCPError {
  code: number;
  message: string;
  data?: any;
}

// MCP Method Types
export interface InitializeRequest {
  protocolVersion: string;
  capabilities: ClientCapabilities;
  clientInfo: ClientInfo;
}

export interface InitializeResponse {
  protocolVersion: string;
  capabilities: ServerCapabilities;
  serverInfo: ServerInfo;
}

export interface ClientCapabilities {
  roots?: {
    listChanged?: boolean;
  };
  sampling?: {};
}

export interface ServerCapabilities {
  logging?: {};
  prompts?: {
    listChanged?: boolean;
  };
  resources?: {
    subscribe?: boolean;
    listChanged?: boolean;
  };
  tools?: {
    listChanged?: boolean;
  };
}

export interface ClientInfo {
  name: string;
  version: string;
}

export interface ServerInfo {
  name: string;
  version: string;
}

// Tool Types
export interface Tool {
  name: string;
  description?: string;
  inputSchema: any; // JSON Schema
}

export interface ToolCallRequest {
  name: string;
  arguments?: any;
}

export interface ToolCallResponse {
  content: ToolCallContent[];
  isError?: boolean;
}

export interface ToolCallContent {
  type: 'text' | 'image' | 'resource';
  text?: string;
  data?: string;
  mimeType?: string;
}

// Resource Types
export interface Resource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface ResourceContent {
  uri: string;
  mimeType?: string;
  text?: string;
  blob?: string;
}

// Prompt Types
export interface Prompt {
  name: string;
  description?: string;
  arguments?: PromptArgument[];
}

export interface PromptArgument {
  name: string;
  description?: string;
  required?: boolean;
}

export interface PromptMessage {
  role: 'user' | 'assistant';
  content: PromptContent;
}

export interface PromptContent {
  type: 'text' | 'image' | 'resource';
  text?: string;
  data?: string;
  mimeType?: string;
}

// Connection States
export enum ConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  INITIALIZED = 'initialized',
  ERROR = 'error'
}

// Transport Types
export interface TransportConfig {
  type: 'websocket' | 'http' | 'stdio';
  url?: string;
  headers?: { [key: string]: string };
}