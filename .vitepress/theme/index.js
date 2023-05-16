import DefaultTheme from 'vitepress/theme'
import Popper from "vue3-popper";
import Word from '@/Word.vue';
import Phrase from '@/Phrase.vue';
import Say from '@/Say.vue';

import './styles/vars.css'
import './styles/gloss.css'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component("Popper", Popper);
        app.component("Word", Word);
        app.component("Phrase", Phrase);
        app.component("Say", Say);
    }
}
