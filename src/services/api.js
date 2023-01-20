
const apiEmploye = {
    "getJsData":"employee-request-form",
    "active":"employee-active-account",
    "getAll":"get/employee",
    "get":"employee-request",
    "post":"employee-request",
    "put":"employee-update-form",
    "delete":"employee-delete-list",
}

const apiUser = {
    "login":"auth/login",
    "get":"user/user-account",
    "getRoles":"/user/rolename-request",
    "delete":"user/remove-role"
}

const apiAgenda = {
    "getData":"agenda-form",
    "getAll":"agenda-list",
    "post":"agenda-request",
    "put":"agenda-updateform",
    "delete":"agenda-delete"
}


export {
    apiEmploye,
    apiUser,
    apiAgenda
}