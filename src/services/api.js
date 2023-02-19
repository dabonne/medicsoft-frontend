
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
    //"getRoles":"user/rolename-request",
    "getRoles":"user/v2/rolename-request",
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

const apiPatient = {
    "getData":"patient-form",
    "getAll":"patient-list",
    "get":"patient-information",
    "post":"patient",
}

const apiParamedical = {
    "post":"add-paramedical",
    "get":"paramedicals",
    "put":"update-paramedical",
    "delete":"delete-paramedical"
}

const apiMedical = {
    "post":"add-medical",
    "get":"medicals",
    "put":"update-medical",
    "delete":"delete-medical",
    "postFamily":"add-medical/personal-family",
    "getPersonalForm":"personal-family-form",
    "getPersonalList":"medical/personal-family",
    "putFamily":"update-medical/personal-family",
    "deleteFamily":"delete-medical/personal-family"
}

export {
    apiEmploye,
    apiUser,
    apiAgenda,
    apiPatient,
    apiParamedical,
    apiMedical
}