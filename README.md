# Angular MCP Client

A comprehensive Angular application for interacting with Model Context Protocol (MCP) servers. This client provides a clean, modern web interface for connecting to MCP servers, executing tools, reading resources, and managing prompts.

## Features

- **WebSocket Connection**: Connect to MCP servers via WebSocket transport
- **Tool Execution**: Discover and execute available tools with real-time results
- **Resource Management**: Browse and read server resources
- **Prompt Interaction**: Access and use server prompts
- **Real-time Updates**: Automatic refresh when server capabilities change
- **Responsive Design**: Modern, mobile-friendly interface
- **Error Handling**: Comprehensive error reporting and connection status

## Architecture

### Core Components

- **MCPService**: Core service handling MCP protocol communication
- **MCPConnectionComponent**: UI for server connection and initialization
- **MCPToolsComponent**: Interface for discovering and executing tools
- **MCPResourcesComponent**: Resource browser and content viewer

### MCP Protocol Support

- Protocol version: `2024-11-05`
- Transport: WebSocket
- Methods supported:
  - `initialize` - Server initialization
  - `tools/list` - List available tools
  - `tools/call` - Execute tools
  - `resources/list` - List available resources
  - `resources/read` - Read resource content
  - `prompts/list` - List available prompts
  - `prompts/get` - Get prompt content

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Angular CLI 20+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sathishchary/Angular-MCP-Client.git
   cd Angular-MCP-Client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser to `http://localhost:4200`

### Building for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

### Running Tests

```bash
npm test
```

## Usage

### Connecting to an MCP Server

1. Enter your MCP server WebSocket URL (e.g., `ws://localhost:8080/mcp`)
2. Click "Connect" to establish the WebSocket connection
3. Click "Initialize" to complete the MCP handshake
4. The interface will automatically discover available tools, resources, and prompts

### Using Tools

1. After successful connection, browse available tools in the Tools panel
2. View tool descriptions and input schemas
3. Enter arguments in JSON format (if required)
4. Click "Execute Tool" to run the tool
5. View results in the result panel

### Accessing Resources

1. Browse available resources in the Resources panel
2. Click "Read Resource" to fetch and display content
3. Text resources are displayed directly
4. Image resources are rendered inline
5. Binary resources show metadata and size information

## Configuration

### Server Connection

The client supports WebSocket connections to MCP servers. Configure your connection in the connection panel:

- **Server URL**: WebSocket endpoint of your MCP server
- **Headers**: Additional headers (if needed for authentication)

### Client Capabilities

The client advertises the following capabilities to servers:

```json
{
  "roots": {
    "listChanged": true
  },
  "sampling": {}
}
```

## Development

### Project Structure

```
src/
├── app/
│   ├── components/           # UI components
│   │   ├── mcp-connection/   # Connection management
│   │   ├── mcp-tools/        # Tool execution
│   │   └── mcp-resources/    # Resource browsing
│   ├── models/              # TypeScript interfaces
│   │   └── mcp.types.ts     # MCP protocol types
│   ├── services/            # Core services
│   │   └── mcp.service.ts   # MCP protocol service
│   ├── app.ts               # Main app component
│   ├── app.html             # App template
│   └── app.scss             # App styles
└── ...
```

### Adding New Features

1. **New MCP Methods**: Add method support in `MCPService`
2. **UI Components**: Create new components following the existing pattern
3. **Type Definitions**: Update `mcp.types.ts` for new protocol features

### Code Style

- Use Angular coding standards
- Follow TypeScript strict mode
- Use reactive programming with signals
- Implement proper error handling
- Write unit tests for new features

## Browser Support

- Chrome/Chromium 100+
- Firefox 100+
- Safari 15+
- Edge 100+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

## MCP Specification

For more information about the Model Context Protocol, visit:
- [MCP Specification](https://modelcontextprotocol.io/specification)
- [MCP Documentation](https://modelcontextprotocol.io/docs)

## Support

For issues and questions:
- Open an issue on GitHub
- Check the MCP community resources

---

## Angular CLI Information

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.1.

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

### Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

### Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.