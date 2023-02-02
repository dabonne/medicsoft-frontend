
const apiEmploye = {
    "getJsData":"employee-request-form",
    "active":"employee-active-account",
    "getAll":"get/employee",
    "get":"employee-request",
    "getPage":"v2/employees?pageNo=",
    "post":"employee-request",
    "put":"employee-update-form",
    "delete":"employee-delete-list",
    "deleteRole":"remove-role",
    "disableAccount":"desactive-account",
}
const apiUser = {
    "login":"auth/login",
    "get":"user/user-account",
    "getRoles":"user/rolename-request",
    "put":"user/update-user-account",
    "profile":"user/user-photo"
    //"delete":"user/remove-role"
}

const apiAgenda = {
    "getData":"agenda-form",
    "getAll":"agenda-list",
    "post":"agenda-request",
    "put":"agenda-updateform",
    "delete":"agenda-delete",
    "agendaEmployee":"agenda-employee-list"
}

export {
    apiEmploye,
    apiUser,
    apiAgenda
}