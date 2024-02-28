
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
    //"login":"auth/login",
    "login":"auth/v2/login",
    "get":"user/user-account",
    //"getRoles":"user/rolename-request",
    "getRoles":"user/v2/rolename-request",
    "put":"user/update-user-account",
    "profile":"user/user-photo",
    //"delete":"user/remove-role"
    "refreshToken":"auth/login-refresh-token",
    "changePassword":"user/update-password",
    "forget":"user/forgot-password"
}

const apiAgenda = {
    "getData":"agenda-form",
    "getAll":"agenda-list",
    "post":"agenda-request",
    "put":"agenda-updateform",
    "delete":"agenda-delete",
    "agendaEmployee":"agenda-employee-list",
    "eventEmploye":"events-employee",
    "eventConsultation":"v2/events"
}

const apiPatient = {
    "getData":"patient-form",
    "getAll":"patient-list",
    "get":"patient-information",
    "post":"patient",
    "putOrDelete":"doctor/patient",
}

const apiParamedical = {
    "post":"add-paramedical",
    "postMulti":"v2/add-multiple-paramedical",
    "get":"paramedicals",
    "put":"v2/update-paramedical",
    "delete":"delete-paramedical",
    "synthese":"doctor/medical-record/synthesis"
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
    "printReport":"doctor/medical-record/report",
    "getListImagery":"prescription/param-type-imagery",
    "getListBiology":"prescription/param-biological-analysis",
    "getListExamen":"prescription/param-consultation",
    "rendezVous":"appointment/add-appointment",
    "rendezVousListe":"appointment/appointment-patient",
    "rendezVousDoctor":"appointment/appointment-list",
    "deleteRendezVous":"appointment",
    "getRendezVous":"appointment",
    "statusRendezVous":"appointment/update-appointment",
    "patientsReduce":"doctor/patients-reduce",
    "appointmentConfirmWait":"appointment/appointment-confirm-wait",
    "statistique":"statistics/consultation-prescriptions",
    "antecedentForm":"doctor/antecedent-form",
    "antecedentRecord":"doctor/medical-record/antecedent",
    "postAntecedent":"doctor/medical-record/antecedent",
    "putAntecedent":"doctor/medical-record/antecedent",
    "antecedent":"medical-record/antecedent"
    
}

const apiPrescription = {
    "getListPresc" : "prescription/param-pharmaceutical-prescription",
    "postOrdonnance":"prescription/add-pharmaceutical-prescription",
    "updateOrdonnance":"prescription/update-pharmaceutical-prescription",
    "getAllPrescri":"prescription/prescriptions-list",
    "getTypeAnalyse":"prescription/param-biological-analysis",
    "postTypeAnalyse":"prescription/add-biological-analysis",
    "updateTypeAnalyse":"prescription/update-biological-analysis",
    "getTypeImagerie":"prescription/param-type-imagery",
    "postTypeImagerie":"prescription/add-medical-imaging",
    "updateTypeImagerie":"prescription/update-medical-imaging",
    "getTypeConsultation":"prescription/param-consultation",
    "postTypeConsultation":"prescription/add-consultation-exam",
    "updateTypeConsultation":"prescription/update-consultation-exam",
    "deletePresc":"prescription/delete-prescription",
    "getPrescriptionById":"prescription/prescription-id",
    "pdfPescription":"prescription/report-prescription"
}

const apiHospitalisation = {
    patient:"patients",
    hospitalRecords:"hospital-records",
}

const apiBackOffice = {
    "familyBiological":"settings/family-biological",
    "familyBiologicalById":"settings/biological-analysis",
    "getLocalisationTypeImagery":"settings/type-imagery"
}
const apiDrug = {
    drugs:"settings/drugs",
    getCategorie:"settings/drug-categories",
    settings:"settings",
    familyBiological:"family-biological"
}
const apiOrganisation = {
    "getJsData":"organisation-request-form",
    "getAll":"organisation-getlist-request",
    "get":"organisation-request",
    "post":"organisation-registration",
    "put":"organisation-update",
    "delete":"organisation-delete",
    "image":"document-head",
    "widoc":"user-patient"
}
export {
    apiEmploye,
    apiUser,
    apiAgenda,
    apiPatient,
    apiParamedical,
    apiMedical,
    apiPrescription,
    apiBackOffice,
    apiHospitalisation,
    apiDrug,
    apiOrganisation
}