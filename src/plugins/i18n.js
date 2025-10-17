import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enmain from './languages/en/main'
import esmain from './languages/es/main'
import ptmain from './languages/pt/main'
import itmain from './languages/it/main'
import swmain from './languages/sw/main'
import idmain from './languages/id/main'
import nlmain from './languages/nl/main'
import hi from './languages/hi'
import mr from './languages/mr'
import ne from './languages/ne'
import el from './languages/el'
import tr from './languages/tr'
import ar from './languages/ar'
import vi from './languages/vi'
import am from './languages/am'
import frmain from './languages/fr/main'
import { en as _en, es as _es, id as _id, pt as _pt, el as _el, tr as _tr, ar as _ar, nl as _nl, fr as _fr, it as _it } from 'vuetify/lib/locale'

Vue.use(VueI18n);

const messages = {
    'en': { ...enmain, $vuetify: _en },
    'hi': hi,
    'mr': mr,
    'vi': vi,
    'es': { ...esmain, $vuetify: _es },
    'ne': ne,
    'id': { ...idmain, $vuetify: _id },
    'pt': { ...ptmain, $vuetify: _pt },
    'el': { ...el, $vuetify: _el },
    'tr': { ...tr, $vuetify: _tr },
    'sw': swmain,
    'ar': { ...ar, $vuetify: _ar },
    'am': am,
    'nl': { ...nlmain, $vuetify: _nl },
    'fr': { ...frmain, $vuetify: _fr },
    'it': { ...itmain, $vuetify: _it }
};

var language = localStorage.getItem('LANGUAGE')
if( language == null){
    language = 'en'
}

export default new VueI18n({
    locale: language,
    fallbackLocale: 'en',
    messages,
    silentTranslationWarn: true
});