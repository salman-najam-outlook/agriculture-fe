export const ROLES = {
     indonesia_ptsi:{
        name: "Indonesia PTSI Main admin",
        value:'indonesia_ptsi'
     },

     indonesia_ptsi_worker:{
        name: "Indonesia PTSI Worker Worker role",
        value:'indonesia_ptsi_worker'
     },
     kenya_ptsi:{
        name: "Kenya PTSI Main admin",
        value:'kenya_ptsi'
     },
     kenya_ptsi_worker:{
        name: "Kenya PTSI Worker Worker role",
        value:'kenya_ptsi_worker'
     }
}

export const PTSI_WORKER_ROLES = [
    ROLES.indonesia_ptsi_worker.value,
    ROLES.kenya_ptsi_worker.value
]
export const PTSI_ADMIN_ROLES  = [
    ROLES.indonesia_ptsi.value,
    ROLES.kenya_ptsi.value
]

export const ALL_PTSI_ROLES = [
    ...PTSI_WORKER_ROLES,
    ...PTSI_ADMIN_ROLES
]