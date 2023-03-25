
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
    "postMulti":"v2/add-multiple-paramedical",
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
    "deleteFamily":"delete-medical/personal-family",
    "postReport":"report",
    "getReport": "report-list",
    "getReportByID": "report-id",
    "updateReport":"update-report",
    "deleteReport":"delete-report",
    "getListImagery":"prescription/param-type-imagery",
    "getListBiology":"prescription/param-biological-analysis",
    "getListExamen":"prescription/param-consultation"
}

const apiPrescription = {
    "getListPresc" : "prescription/param-pharmaceutical-prescription",
    "postOrdonnance":"prescription/add-pharmaceutical-prescription",
    "getAllPrescri":"prescription/prescriptions-list",
    "getTypeAnalyse":"prescription/param-biological-analysis",
    "postTypeAnalyse":"prescription/add-biological-analysis",
    "getTypeImagerie":"prescription/param-type-imagery",
    "postTypeImagerie":"prescription/add-medical-imaging",
    "getTypeConsultation":"prescription/param-consultation",
    "postTypeConsultation":"prescription/add-consultation-exam",
    "deletePresc":"prescription/delete-prescription",
    "getPrescriptionById":"prescription/prescription-id"
}


export {
    apiEmploye,
    apiUser,
    apiAgenda,
    apiPatient,
    apiParamedical,
    apiMedical,
    apiPrescription
}