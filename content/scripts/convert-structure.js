import FastGlob from 'fast-glob'
import { readFile, writeFile, mkdir, rm } from 'fs/promises'
import { dirname, resolve, basename } from 'path'
import { fileURLToPath } from 'url'

const collections = ['dimensions', 'skills', 'tags', 'tools', 'stories']

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * This script converts selected collections to from working with the `single_files` config option in Netlify CMS.
 * Instead, content is convertes to work with the `multiple_folders` config.
 *
 * This adds support for managing localization using Weblate, which needs specific file paths for each locale.
 */
await Promise.all(
    collections.flatMap(async (collection) => {
        const paths = await FastGlob(resolve(`${__dirname}/../src/${collection}/*.json`))
        return paths.flatMap(async (path) => {
            const translatedContent = await readFile(path, { encoding: 'utf-8' }).then(JSON.parse)

            return Object.entries(translatedContent).flatMap(async ([locale, content]) => {
                await mkdir(resolve(dirname(path), locale), { recursive: true })
                await writeFile(
                    resolve(dirname(path), locale, basename(path)),
                    JSON.stringify(content, null, 4),
                    { encoding: 'utf-8' },
                )
                await rm(path)
            })
        })
    }),
)
