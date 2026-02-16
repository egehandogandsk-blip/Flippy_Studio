import { IPlugin, IPluginContext } from '../../core/types';
import { GameChangerUI } from './UI';

export const GameChangerPlugin: IPlugin = {
    id: 'game-changer',
    name: 'Game Changer',
    description: 'A placeholder for game changing features.',
    version: '0.1.0-alpha',
    initialize: (_context: IPluginContext) => {
        // Initialization logic for Game Changer
    },
    render: () => <GameChangerUI />
};
