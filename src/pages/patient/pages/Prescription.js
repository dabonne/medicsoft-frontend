import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { apiPrescription } from "../../../services/api";
import PrescriptionForm from "../components/PrescriptionForm";
import PrescriptionFormOrdonance from "../components/PrescriptionFormOrdonance";
import PrescriptionListe from "../components/PrescriptionListe";

const Prescription = ({ setLocation }) => {
  useEffect(() => {
    setLocation(window.location.pathname);
  }, []);

  return (
    <div className="container-fluid">
      <Routes>
        <Route path="/" element={<PrescriptionListe />} />
        <Route
          path="/ordonnance-medicale"
          element={<PrescriptionFormOrdonance />}
        />
        <Route
          path="/form-analyse-biologique"
          element={
            <PrescriptionForm
              title={"Analyses biologiques"}
              group={"Groupe d'examen"}
              type={"Type d'examen"}
              url={{
                get: apiPrescription.getTypeAnalyse,
                post: apiPrescription.postTypeAnalyse,
              }}
            />
          }
        />
        <Route
          path="/form-imagerie"
          element={
            <PrescriptionForm
              title={"Imagerie Médicale"}
              group={"Groupe d'imagerie"}
              type={"Type d'imagerie"}
              url={{
                get: apiPrescription.getTypeImagerie,
                post: apiPrescription.postTypeImagerie,
              }}
            />
          }
        />
        <Route
          path="/form-examen-specialise"
          element={
            <PrescriptionForm
              title={"Consultation / Examen specialisé"}
              type={"Type de consultation et/ou examen spécialisé"}
              url={{
                get: apiPrescription.getTypeConsultation,
                post: apiPrescription.postTypeConsultation,
              }}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default Prescription;
