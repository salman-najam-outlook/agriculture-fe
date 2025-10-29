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
import approvalFlow from './approval-flow'

import { pt } from "vuetify/lib/locale";
import indigenous from './indigenous'
import esgPlatform from './esgPlatform'
import carbonCredit from './carbonCredit'
import updatePassword from './update-password';

export default {
    $vuetify: { ...pt },
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
    ...esgPlatform,
    ...carbonCredit,
    ...approvalFlow,
    ...updatePassword,
}

