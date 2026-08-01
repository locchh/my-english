import { defineConfig } from 'vite'
import { resolve } from 'path'


// Multi-page build config: register one entry per page here (see
// rolldownOptions.input below) or `vite build` will skip it in dist/.
export default defineConfig({
    build: {
        rolldownOptions: {
            input: {
                // key = arbitrary chunk name, value = absolute path to that page's html
                home: resolve(import.meta.dirname, 'index.html'),
                ipa: resolve(import.meta.dirname, 'ipa.html'),
                verbs: resolve(import.meta.dirname, 'verbs.html'),
                tenses: resolve(import.meta.dirname, 'tenses.html'),
                talk: resolve(import.meta.dirname, 'talk.html')
            }
        }
    }
})
