
import { IPlugin, IPluginContext } from '../../core/types';
import { NanoBananaUI } from './UI';

export const NanoBananaPlugin: IPlugin = {
    id: 'nano-banana',
    name: 'Nano Banana',
    description: 'AI Image Generation powered by Google Gemini 2.5 Flash',
    version: '1.0.0',
    initialize: (_context: IPluginContext) => {
        // Register components or services here if needed
        // context.registerComponent('NanoBananaWidget', NanoBananaUI);
    },
    render: () => <NanoBananaUI />
};
