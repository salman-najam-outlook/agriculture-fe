import auth  from './auth'
import blends from './blends'
import coffeecacao from './coffeecacao'
import common from './common'
import dashboard from './dashboard'
import dds from './dds'
import error from './error'
import farm from './farm'
import oma from './oma'
import report from './report'
import settings from './settings'
import survey from './survey'
import traceability from './traceability'
import regionalRiskAssessment from './regionalRiskAssessment'
import carbonCredit from './carbonCredit'
import approvalFlow from './approval-flow'

import { en } from "vuetify/lib/locale";
import indigenous from './indigenous'
import marketplace from './marketplace'
import esgPlatform from './esgPlatform'
import ptsi from './ptsi'   
import updatePassword from './update-password'

export default {
    $vuetify: { ...en },
    ...auth,
    ...coffeecacao,
    ...common,
    ...dashboard,
    ...dds,
    ...error,
    ...farm,
    ...oma,
    ...report,
    ...settings,
    ...survey,
    ...traceability,
    ...blends,
    ...regionalRiskAssessment,
    ...indigenous,
    ...marketplace,
    ...esgPlatform,
    ...carbonCredit,
    ...ptsi,
    ...approvalFlow,
    ...updatePassword,
}

