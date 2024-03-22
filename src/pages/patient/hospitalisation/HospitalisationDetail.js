import React, { useContext, useEffect, useRef, useState } from "react";
import back from "../../../assets/imgs/back.png";
import sui from "../../../assets/imgs/sui.png";
import view from "../../../assets/imgs/view.png";
import edit from "../../../assets/imgs/edit.png";
import del from "../../../assets/imgs/delete.png";
import user from "../../../assets/imgs/user.png";
import print from "../../../assets/imgs/print.png";
import bk from "../../../assets/imgs/bk.png";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import Dossier from "../components/DossierMedicaux";
import AntecedentPersonnel from "../components/AntecedentPersonnel";
import { useFormik } from "formik";
import FormNotify from "../../../components/FormNotify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { apiHospitalisation, apiMedical } from "../../../services/api";
import { AppContext } from "../../../services/context";
import Loading from "../../../components/Loading";
import { matrice, onSearch } from "../../../services/service";
import requestHospitalisation from "../../../services/requestHospitalisation";
import Input from "../../../components/Input";
import FIchierHospi from "./FIchierHospi";
import ObservationHospi from "./ObservationHospi";
import * as Yup from "yup";
import NotifyRef from "../../../components/NofifyRef";
import InformationPatient from "../../../components/InformationPatient";

const initData = {
  releaseDate: "",
};

const validateData = Yup.object({
  releaseDate: Yup.string().required("Le champ est obligatoire"),
});

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
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [modalNotifyMsg, setModalNotifyMsg] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const closeRef = useRef();
  const notifyRef = useRef();

  useEffect(() => {
    get();
    setLocation(window.location.pathname);
  }, []);

  const formik = useFormik({
    initialValues: initData,
    validationSchema: validateData,
    onSubmit: (values) => {
      console.log(values);
      console.log(hospitalDetail);
      values = {
        ...hospitalDetail,
        releaseDate: values.releaseDate,
        uuid: hospitalDetail.hospitalRecordId,
      };
      update(values);
      if (values.uuid) {
        // update(values);
      } else {
        // post(values);
      }
    },
  });

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
  const update = (values) => {
    //e.preventDefault();
    configNotify("loading", "", "Modification des données en cours...");
    console.log(values);
    requestHospitalisation
      .put(
        apiHospitalisation.hospitalRecords + "/" + values.uuid,
        values,
        header
      )
      .then((res) => {
        //console.log("enregistrement ok");
        setModalNotifyMsg("Les informations ont bien été enrégistrées");
        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );

        closeRef.current.click();
        notifyRef.current.click();
        //setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
        configNotify(
          "danger",
          "Oups !",
          "Une erreur est survenue. Veuillez réessayer ultérieurement..."
        );
      });
  };
  const configNotify = (bg, title, message) => {
    setNotifyBg(bg);
    setNotifyTitle(title);
    setNotifyMessage(message);
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
                  <span
                    className="text-muted text-decoration-underline cursor"
                    data-bs-toggle="modal"
                    data-bs-target="#viewAtt"
                  >
                    Voir les détails
                  </span>{" "}
                </span>{" "}
                <br />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="btn-group">
                {hospitalDetail.releaseDate ? null : (
                  <div
                    className="btn btn-primary me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#create"
                  >
                    Date de sortie
                  </div>
                )}
                <div
                  className="btn btn-primary me-2"
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
                <Link
                  className="btn btn-secondary me-2"
                  to={"/dashboard/hospitalisation/details/prescriptions"}
                >
                 Faire une prescription
                </Link>
              </div>
            </div>
          </div>
          <InformationPatient disableBtn ={true} />
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
          <div className="modal fade" id="viewAtt">
            <div className="modal-dialog modal-dialog-centered modal-md">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <h4 className="modal-title text-meduim text-bold"></h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>

                <div className="modal-body">
                  <span className="fw-bold">Date d'entrée : </span>
                  <span>{hospitalDetail.entryDate}</span> <br />
                  <span className="fw-bold">Date de sortie : </span>
                  <span>
                    {hospitalDetail.releaseDate
                      ? hospitalDetail.releaseDate
                      : "Toujours en hospitalisation"}
                  </span>{" "}
                  <br />
                  <span className="fw-bold">Motif : </span>
                  <span>{hospitalDetail.motifHospitalisation}</span> <br />
                  <span className="fw-bold">Examen clinique : </span>
                  <span>{hospitalDetail.examClinic}</span> <br />
                  <span className="fw-bold">Histoire de la maladie : </span>
                  <span>{hospitalDetail.historyDisease}</span> <br />
                  <span className="fw-bold">Conclusion : </span>
                  <span>{hospitalDetail.conclusion}</span> <br />
                </div>

                <div className="modal-footer border-0 d-flex justify-content-start">
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={(e) => {
                      e.preventDefault();
                      //setModalNotifyMsg("");
                    }}
                  >
                    Ok
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" id="create">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <h4 className="modal-title text-meduim">
                    Modification de la date
                  </h4>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <div className="modal-body">
                  {notifyBg !== "" ? (
                    <FormNotify
                      bg={notifyBg}
                      title={notifyTitle}
                      message={notifyMessage}
                    />
                  ) : null}
                  <form className={"mt-3"} onSubmit={formik.handleSubmit}>
                    <div className="mb-5">
                      <Input
                        type={"date"}
                        name={"releaseDate"}
                        label={"Date d'entrée"}
                        placeholder={"Entrer la date"}
                        formik={formik}
                      />
                    </div>

                    <div className="modal-footer d-flex justify-content-start border-0">
                      <button
                        className="btn btn-danger"
                        data-bs-dismiss="modal"
                        ref={closeRef}
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        Annuler
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Enregistrer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <NotifyRef
            notifyRef={notifyRef}
            setNotifyBg={setNotifyBg}
            modalNotifyMsg={modalNotifyMsg}
          />
        </>
      ) : (
        <>
          <div>
            <span
              className="cursor fw-bold"
              onClick={(e) => changeView(e, "home")}
            >
              <div className="d-inline-block">
                <span className="d-inline-block me-2">
                  <img src={bk} alt="" />
                </span>
                <span className="d-inline-block text-bold">retour</span>
              </div>
            </span>
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
