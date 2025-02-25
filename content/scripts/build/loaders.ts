import { resolve } from 'path'
import type {
    AllContent,
    CommunityContent,
    Contributor,
    Dimension,
    FeaturedContent,
    Locale,
    Localised,
    Skill,
    Story,
    Tag,
    Tool,
    ToolsContent,
} from '$shared/types'
import { getPaths, readJSON } from '../utils'
import type { BuilderInput } from './builders'

type LoaderInput = {
    contentDir: string
    locale: Locale
}

const loadJSONPaths = (paths: string[]) => Promise.all(paths.map(readJSON))

const loadLocalisedContent = <T>(
    contentType: Omit<keyof AllContent, 'contributors' | 'featured'>,
    { contentDir, locale }: LoaderInput,
): Promise<T[]> => getPaths(contentDir, `${contentType}/${locale}/*.json`).then(loadJSONPaths)

/**
 * Content loaders are a set of functions responsible for loading specific content types.
 * Depending on the structure, some content types are localised while others are not.
 */
export const LOADERS = {
    async contributors({ contentDir }: LoaderInput): Promise<Contributor[]> {
        return getPaths(contentDir, `contributors/*.json`).then(loadJSONPaths)
    },
    async tags(loaderInput: LoaderInput): Promise<Tag[]> {
        return loadLocalisedContent('tags', loaderInput)
    },
    async skills(loaderInput: LoaderInput): Promise<Skill[]> {
        return loadLocalisedContent('skills', loaderInput)
    },
    async dimensions(loaderInput: LoaderInput): Promise<Dimension[]> {
        return loadLocalisedContent('dimensions', loaderInput)
    },
    async tools(loaderInput: LoaderInput): Promise<Tool[]> {
        return loadLocalisedContent('tools', loaderInput)
    },
    async stories(loaderInput: LoaderInput): Promise<Story[]> {
        return loadLocalisedContent('stories', loaderInput)
    },
    async featured({ contentDir, locale }: LoaderInput): Promise<FeaturedContent> {
        return readJSON(resolve(contentDir, `settings/${locale}/featured.json`))
    },
}

/**
 * Bundle loaders are responsible for loading the content types needed for specific bundles.
 * They return localised content that can be further processed.
 */
export const BUNDLE_LOADERS = {
    community: (builderInput: BuilderInput<CommunityContent>) => {
        return loadContent<CommunityContent>(builderInput)
    },
    tools: (builderInput: BuilderInput<ToolsContent>) => {
        return loadContent<ToolsContent>(builderInput)
    },
}

async function loadContent<T>({
    selectedLocales,
    selectedContent,
    contentDir,
}: {
    selectedLocales: Locale[]
    selectedContent: (keyof T)[]
    contentDir: string
}) {
    // Load all selectedLocales in parallell
    const loadedContent: [Locale, T][] = await Promise.all(
        selectedLocales.map(async (locale) => {
            const loaderInput = { locale, contentDir }
            // Load all content types in parallell to improve performance
            const loadedContent = await Promise.all(
                selectedContent.map((contentType) => {
                    return LOADERS[contentType as keyof typeof LOADERS](loaderInput)
                }),
            )

            const content = selectedContent.reduce<T>((result, contentType, i) => {
                // Might be a better type instead of `any` here.
                // Maybe define that T satisfies ToolsContent | CommunityContent or something like that.
                result[contentType] = loadedContent[i] as any
                return result
            }, {} as T)

            return [locale, content]
        }),
    )

    // Combine all locales into one object that is easier to work with during transformations
    return loadedContent.reduce((allContent, [locale, content]) => {
        allContent[locale] = content
        return allContent
    }, {} as Localised<T>)
}
