import React, { useContext, useEffect, useRef, useState } from "react";
import back from "../../../assets/imgs/back.png";
import sui from "../../../assets/imgs/sui.png";
import view from "../../../assets/imgs/view.png";
import edit from "../../../assets/imgs/edit.png";
import del from "../../../assets/imgs/delete.png";
import user from "../../../assets/imgs/user.png";
import print from "../../../assets/imgs/print.png";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import Dossier from "../components/DossierMedicaux";
import AntecedentPersonnel from "../components/AntecedentPersonnel";
import { useFormik } from "formik";
import FormNotify from "../../../components/FormNotify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import requestPatient from "../../../services/requestPatient";
import { apiHospitalisation, apiMedical } from "../../../services/api";
import { AppContext } from "../../../services/context";
import Loading from "../../../components/Loading";
import { matrice, onSearch } from "../../../services/service";
import requestDoctor from "../../../services/requestDoctor";
import requestHospitalisation from "../../../services/requestHospitalisation";
import Input from "../../../components/Input";
import Observation from "./Observation";
import FIchierHospi from "./FIchierHospi";
import ObservationHospi from "./ObservationHospi";

const initData = {
  motifHospitalisation: "",
  historyDisease: "",
  examClinic: "",
  conclusion: "",
  entryDate: "",
};
const HospitalisationDetail = ({ setLocation = () => {} }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const header = {
    headers: { Authorization: `${user.token}` },
  };
  const [fail, setFail] = useState(false);
  const { id } = useParams();
  const [hospitalDetail, setHospitalDetail] = useState({});
  const [view, setView] = useState("home");

  useEffect(() => {
    get();
    setLocation(window.location.pathname);
  }, []);

  const get = () => {
    requestHospitalisation
      .get(apiHospitalisation.hospitalRecords + "/" + id, header)
      .then((res) => {
        console.log(res.data);
        setHospitalDetail(res.data);
      })
      .catch((error) => {
        console.log(error);
        setFail(true);
      });
  };

  const changeView = (e, name) => {
    e.preventDefault();
    setView(name);
  };

  return (
    <>
      {view === "home" ? (
        <>
          <div className="row my-3">
            <div className="col-12 col-md-6">
              <div className=" me-3 text-bold text-meduim align-top">
                <span>{hospitalDetail.motifHospitalisation}</span>
              </div>
              <div className="d-inline-block">
                <div>
                  <span className="fw-bold">Date d'entrée : </span>
                  <span>{hospitalDetail.entryDate}</span> <br />
                  <span className="fw-bold">Date de sortie : </span>
                  <span>
                    {hospitalDetail.releaseDate
                      ? hospitalDetail.releaseDate
                      : "Toujours en hospitalisation"}
                  </span>
                </div>
                <span>
                  <Link
                    to="/dashboard/patient/dossier-paramedical"
                    className="text-black"
                  >
                    Voir les détails
                  </Link>{" "}
                </span>{" "}
                <br />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="btn-group">
                <div
                  className="btn btn-primary me-2"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  Date de sortie
                </div>
                <div
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      "https://doctor-management.herokuapp.com/doctor-management/external-api/hospital-records/" +
                        id +
                        "/export-dossier/" +
                        user.organisationRef
                    );
                  }}
                >
                  Exporter le dossier
                </div>
              </div>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-md-5 my-5">
            <div className="col">
              <div
                onClick={(e) => changeView(e, "antecedent")}
                className="d-flex justify-content-center align-items-center border border-1 border-radius btn-height text-black text-decoration-none"
              >
                <div className="text-center">
                  <span className="text-bold">Antécédents</span> <br />
                </div>
              </div>
            </div>
            <div className="col">
              <div
                onClick={(e) => changeView(e, "observation")}
                className="d-flex justify-content-center align-items-center border border-1 border-radius btn-height text-black text-decoration-none"
              >
                <div className="text-center">
                  <span className="text-bold">Observations</span> <br />
                </div>
              </div>
            </div>
            <div className="col">
              <div
                onClick={(e) => changeView(e, "fichier")}
                className="d-flex justify-content-center align-items-center border border-1 border-radius btn-height text-black text-decoration-none"
              >
                <div className="text-center">
                  <span className="text-bold">Fichiers</span> <br />
                </div>
              </div>
            </div>
            {/**
               * <div className="col">
              <div
                onClick={(e) => changeView(e, "evolution")}
                className="d-flex justify-content-center align-items-center border border-1 border-radius btn-height text-black text-decoration-none"
              >
                <div className="text-center">
                  <span className="text-bold">Evolutions</span> <br />
                </div>
              </div>
            </div>
            <div className="col">
              <div
                onClick={(e) => changeView(e, "conclusion")}
                className="d-flex justify-content-center align-items-center border border-1 border-radius btn-height text-black text-decoration-none"
              >
                <div className="text-center">
                  <span className="text-bold">Conclusions</span> <br />
                </div>
              </div>
            </div>
               */}
          </div>
        </>
      ) : (
        <>
          <div>
            <span onClick={(e) => changeView(e, "home")}>Retour</span>
          </div>
          {view === "antecedent" && <AntecedentPersonnel />}
          {view === "observation" && <ObservationHospi />}
          {view === "evolution" && <AntecedentPersonnel />}
          {view === "conclusion" && <AntecedentPersonnel />}
          {view === "fichier" && <FIchierHospi />}
        </>
      )}
    </>
  );
};

export default HospitalisationDetail;
