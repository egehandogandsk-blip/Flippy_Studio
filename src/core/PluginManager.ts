import { IPlugin, IPluginContext } from './types';

class PluginManager {
    private plugins: Map<string, IPlugin> = new Map();
    private components: Map<string, React.ComponentType> = new Map();

    constructor() { }

    registerPlugin(plugin: IPlugin) {
        if (this.plugins.has(plugin.id)) {
            console.warn(`Plugin ${plugin.id} is already registered.`);
            return;
        }

        const context: IPluginContext = {
            registerComponent: (name, component) => {
                this.components.set(name, component);
            },
        };

        plugin.initialize(context);
        this.plugins.set(plugin.id, plugin);
        console.log(`Plugin ${plugin.name} loaded.`);
    }

    getPlugin(id: string): IPlugin | undefined {
        return this.plugins.get(id);
    }

    getAllPlugins(): IPlugin[] {
        return Array.from(this.plugins.values());
    }

    getComponent(name: string): React.ComponentType | undefined {
        return this.components.get(name);
    }
}

export const pluginManager = new PluginManager();
