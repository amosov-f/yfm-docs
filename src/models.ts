import {Logger} from '@doc-tools/transform/lib/log';
import {LintConfig} from '@doc-tools/transform/lib/yfmlint';

import {FileContributors, VCSConnector, VCSConnectorConfig} from './vcs-connector/connector-models';
import {Lang, Stage, IncludeMode, ResourceType} from './constants';

export type VarsPreset = 'internal'|'external';

export type YfmPreset = Record<string, string>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Metadata = Record<string, any>;

export type ContributorsByPathFunction = (path: string) => Promise<FileContributors>;
export type NestedContributorsForPathFunction = (path: string, nestedContributors: Contributors) => void;
export type UserByLoginFunction = (login: string) => Promise<Contributor | null>;
export type CollectionOfPluginsFunction = (output: string, options: PluginOptions) => string;

interface YfmConfig {
    varsPreset: VarsPreset;
    ignore: string[];
    outputFormat: string;
    allowHTML: boolean;
    vars: Record<string, string>;
    applyPresets: boolean;
    resolveConditions: boolean;
    conditionsInCode: boolean;
    disableLiquid: boolean;
    strict: boolean;
    ignoreStage: string;
    singlePage: boolean;
    removeHiddenTocItems: boolean;
    connector?: VCSConnectorConfig;
    lang?: Lang;
    lintDisabled: boolean;
    buildDisabled: boolean;
    lintConfig: LintConfig;
    resources?: Resources;
    yandexCloudTranslateFolderId: string;
    yandexCloudTranslateGlossaryPairs: YandexCloudTranslateGlossaryPair[];
}

export interface YfmArgv extends YfmConfig {
    rootInput: string;
    input: string;
    output: string;
    quiet: string;
    publish: boolean;
    storageEndpoint: string;
    storageBucket: string;
    storagePrefix: string;
    storageKeyId: string;
    storageSecretKey: string;
    contributors: boolean;
    addSystemMeta: boolean;
    addMapFile: boolean;
    allowCustomResources: boolean;
}

export interface DocPreset {
    default: YfmPreset;
    [varsPreset: string]: YfmPreset;
}

export interface YfmToc extends Filter {
    name: string;
    href: string;
    items: YfmToc[];
    stage?: Stage;
    base?: string;
    title?: TextItems;
    include?: YfmTocInclude;
    id?: string;
    singlePage?: boolean;
}

export interface YfmTocInclude {
    repo: string;
    path: string;
    mode?: IncludeMode;
    includer?: IncluderName;
}

export const includersNames = ['sourcedocs', 'openapi'] as const;

export type IncluderName = typeof includersNames[number];

export type Includer = {
    name: IncluderName;
    generateTocs?: IncluderFn;
    generateLeadingPages?: IncluderFn;
    generateContent?: IncluderFn;
    generatePath: IncluderGeneratePathFn;
};

export type IncluderFn = (params: IncluderFnParams) => IncluderFnOutput;

export type IncluderFnParams = {include: YfmTocInclude; name: string; root: string};

export type IncluderFnOutputElement = {path: string; content: LeadingPage | YfmToc | string};

export type IncluderFnOutput = Promise<IncluderFnOutputElement[]>;

export type IncluderGeneratePathFn = (params: IncluderFnParams) => Promise<string>;

export interface LeadingPage {
    title: TextItems;
    description?: TextItems;
    meta?: {
        title?: TextItems;
        noIndex?: boolean;
    };
    nav?: {
        title: TextItems;
    };
    links: LeadingPageLinks[];
}

export type TextItems = string | (TextItem | string)[];

export interface TextItem extends Filter {
    text: string | string[];
}

export interface LeadingPageLinks extends Filter {
    title?: string;
    description?: string;
    href?: string;
}

export interface Filter {
    when?: boolean|string;
    [key: string]: unknown;
}

export interface SinglePageResult {
    path: string;
    content: string;
    title?: string;
}

export interface Contributor {
    avatar: string;
    email: string;
    login: string;
    name: string;
    url: string;
}

export interface Contributors {
    [email: string]: Contributor;
}

export interface FileData {
    tmpInputFilePath: string;
    inputFolderPathLength: number;
    fileContent: string;
    sourcePath?: string;
}

export interface MetaDataOptions {
    fileData: FileData;
    isContributorsEnabled?: boolean;
    vcsConnector?: VCSConnector;
    addSystemMeta?: boolean;
    addSourcePath?: boolean;
    resources?: Resources;
}

export interface PluginOptions {
    vars: YfmPreset;
    path: string;
    log: Logger;
    copyFile: (targetPath: string, targetDestPath: string, options?: PluginOptions) => void;
    singlePage?: boolean;
    root?: string;
    destPath?: string;
    destRoot?: string;
    collectOfPlugins?: (input: string, options: PluginOptions) => string;
}

export interface Plugin {
    collect: (input: string, options: PluginOptions) => string | void;
}

export interface ResolveMd2MdOptions {
    inputPath: string;
    outputPath: string;
    metadata?: MetaDataOptions;
}

export interface ResolverOptions {
    inputPath: string;
    filename: string;
    fileExtension: string;
    outputPath: string;
    outputBundlePath: string;
    metadata?: MetaDataOptions;
}

export interface PathData {
    pathToFile: string;
    resolvedPathToFile: string;
    filename: string;
    fileBaseName: string;
    fileExtension: string;
    outputDir: string;
    outputPath: string;
    outputFormat: string;
    outputBundlePath: string;
    outputTocDir: string;
    inputFolderPath: string;
    outputFolderPath: string;
}

export interface ResolveMd2HTMLResult {
    data: {
        leading: boolean;
        toc: YfmToc;
        html: string;
        title?: string;
        headings: unknown[];
        assets?: unknown[];
        meta?: object;
    };
    router: {
        pathname: string;
    };
    lang: Lang;
}

export type Resources = {
    [key in ResourceType]?: string[];
};

export type YandexCloudTranslateGlossaryPair = {
  sourceText: string;
  translatedText: string;
};
