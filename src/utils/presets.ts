import {dirname, relative, resolve} from 'path';

import {ArgvService, PresetService} from '../services';

export function getVarsPerFile(filePath: string): Record<string, string> {
    const {vars: argVars} = ArgvService.getConfig();

    return {
        ...PresetService.get(dirname(filePath)),
        ...argVars,
    };
}

export function getVarsPerRelativeFile(filePath: string): Record<string, string> {
    const {input} = ArgvService.getConfig();
    const root = resolve(input);
    const relativeFilePath = relative(root, filePath);

    return getVarsPerFile(relativeFilePath);
}
