
export interface IPluginContext {
    registerComponent: (name: string, component: React.ComponentType) => void;
    // Add other capabilities as needed (e.g., event bus, shared state)
}

export interface IPlugin {
    id: string;
    name: string;
    description: string;
    version: string;
    initialize: (context: IPluginContext) => void;
    render?: () => React.ReactNode;
}
