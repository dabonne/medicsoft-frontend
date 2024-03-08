import React, { useContext, useEffect, useRef, useState } from "react";
import back from "../../../assets/imgs/back.png";
import sui from "../../../assets/imgs/sui.png";
import view from "../../../assets/imgs/view.png";
import edit from "../../../assets/imgs/edit.png";
import del from "../../../assets/imgs/delete.png";
import user from "../../../assets/imgs/user.png";
import print from "../../../assets/imgs/print.png";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
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

const initData = {
  motifHospitalisation: "",
  historyDisease: "",
  examClinic: "",
  conclusion: "",
  entryDate: "",
  releaseDate: "",
};
const HospitalisationListe = ({ setLocation = () => {} }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [search, setSearch] = useState("");
  const [stopLoad, setStopLoad] = useState(false);
  const [list, setList] = useState([]);
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [modalNotifyMsg, setModalNotifyMsg] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [value, setValue] = useState("");
  const [editMode, setEditMode] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [deleteId, setDeleteId] = useState("");
  const closeRef = useRef();
  const notifyRef = useRef();
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const navigate = useNavigate();
  const header = {
    headers: { Authorization: `${user.token}` },
  };
  const [fail, setFail] = useState(false);

  useEffect(() => {
    get();
    setLocation(window.location.pathname);
  }, [refresh]);

  const makeSearch = (e) => {
    e.preventDefault();
    onSearch(e, setList, datas, [
      "editDate",
      "editBy",
      "description",
      "nameDoctor",
      "specialityDoctor",
      "numberOrder",
    ]);
  };

  const formik = useFormik({
    initialValues: initData,
    onSubmit: (values) => {
      console.log(values);
      if (values.uuid) {
        update(values);
      } else {
        post(values);
      }
    },
  });

  const post = (values) => {
    //e.preventDefault();
    configNotify("loading", "", "Ajout des données en cours...");
    console.log(value);
    requestHospitalisation
      .post(
        apiHospitalisation.patient + "/" + user.patientId + "/hospital-records",
        values,
        header
      )
      .then((res) => {
        console.log("enregistrement ok");
        setModalNotifyMsg("Les informations ont bien été enrégistrées");
        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );

        closeRef.current.click();
        notifyRef.current.click();
        setRefresh(refresh + 1);
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
  const update = (values) => {
    //e.preventDefault();
    configNotify("loading", "", "Ajout des données en cours...");
    console.log(value);
    requestHospitalisation
      .put(
        apiHospitalisation.patient +
          "/" +
          user.patientId +
          "/hospital-records/" +
          values.uuid,
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
        setRefresh(refresh + 1);
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
  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log(editMode);
    configNotify("loading", "", "Ajout des données en cours...");
    //console.log(apiMedical.updateReport + "/" + user.organisationRef + "/" + editMode+"?description="+value);
    requestPatient
      .put(
        apiMedical.updateReport +
          "/" +
          user.organisationRef +
          "/" +
          editMode +
          "?description=" +
          value,
        {
          patientCni: user.cni,
          description: value,
        },
        header
      )
      .then((res) => {
        console.log("enregistrement ok");
        setModalNotifyMsg("Les informations ont bien été enrégistrées");
        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );

        closeRef.current.click();
        notifyRef.current.click();
        setRefresh(refresh + 1);
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

  const get = () => {
    requestHospitalisation
      .get(
        apiHospitalisation.patient + "/" + user.patientId + "/hospital-records",
        header
      )
      .then((res) => {
        console.log(res.data);
        setStopLoad(true);
        const data = matrice(res.data);
        setPagination(data.list);
        if (data.list.length !== 0) {
          setDatas(data.list[0]);
          setList(data.list[0]);
          setTotalPage(data.counter);
        } else {
          setTotalPage(data.counter + 1);
        }
      })
      .catch((error) => {
        console.log(error);
        setStopLoad(true);
        setFail(true);
      });
  };
  const viewCompteRendu = (id) => {
    requestPatient
      .get(apiMedical.getReportByID + "/" + id, header)
      .then((res) => {
        console.log("view");
        console.log(res.data);
        setValue(res.data.description);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onDelete = (id) => {
    requestHospitalisation
      .delete(apiHospitalisation.hospitalRecords + "/" + id)
      .then((res) => {
        setModalNotifyMsg("Suppression réussie !");
        closeRef.current.click();
        notifyRef.current.click();
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const configNotify = (bg, title, message) => {
    setNotifyBg(bg);
    setNotifyTitle(title);
    setNotifyMessage(message);
  };
  const makePagination = (e, page) => {
    e.preventDefault();
    if (page === "suiv" && pageNumber < Number(totalPage) - 1) {
      setPageNumber(pageNumber + 1);
      setList(pagination[pageNumber + 1]);
      setDatas(pagination[pageNumber + 1]);
    }
    if (page === "prece" && pageNumber >= 1) {
      setPageNumber(pageNumber - 1);
      setList(pagination[pageNumber - 1]);
      setDatas(pagination[pageNumber - 1]);
    }
  };

  const printCompteRendu = (e, id) => {
    e.preventDefault();
    requestDoctor
      .get(apiMedical.printReport + "/" + id + "/" + user.organisationRef)
      .then((res) => {
        window.open("https://laafivisionmedical.com/" + res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setEditData = (e, data) => {
    e.preventDefault();
    formik.setFieldValue("entryDate", data.entryDate);
    formik.setFieldValue("conclusion", data.conclusion);
    formik.setFieldValue("releaseDate", data.releaseDate);
    formik.setFieldValue("examClinic", data.examClinic);
    formik.setFieldValue("motifHospitalisation", data.motifHospitalisation);
    formik.setFieldValue("historyDisease", data.historyDisease);
    formik.setFieldValue("uuid", data.hospitalRecordId);
  };
  const goToDetail = (e, id) => {
    e.preventDefault();
    navigate("detail/" + id);
  };
  return (
    <div className="container-fluid">
      <div className="row my-3">
        <div className="col-9">
          <div className="d-inline-block">
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                makeSearch(e);
              }}
            />
          </div>
          <div className="btn-group">
            <div
              className="d-inline-block my-1 mx-1"
              onClick={(e) => makePagination(e, "prece")}
            >
              <img src={back} alt="" />
            </div>
            <div
              className="d-inline-block my-1 mx-1"
              onClick={(e) => makePagination(e, "suiv")}
            >
              <img src={sui} alt="" />
            </div>
          </div>
          <div className="d-inline-block my-1 mx-1 text-meduim text-bold">
            {pageNumber + 1}/{totalPage}
          </div>
        </div>
        <div className="d-flex justify-content-end ">
          <button
            className="btn btn-primary ms-auto"
            data-bs-target="#create"
            data-bs-toggle="modal"
            onClick={(e) => setValue("")}
          >
            Envoyer en hospitalisation
          </button>
        </div>
      </div>

      <Loading data={datas} stopLoad={stopLoad} fail={fail}>
        <div className="table-responsive-lg">
          <table className="table table-striped align-middle">
            <thead>
              <tr className="align-middle">
                <th scope="col" className="border-raduis-left">
                  Motif
                </th>
                <th scope="col">Date d'entrée</th>
                <th scope="col">Date de sortie</th>
                <th scope="col" className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((data, idx) => {
                //data.checkValue = false
                return (
                  <tr key={idx}>
                    <td>
                      <span className="text-bold">
                        {data.motifHospitalisation}
                      </span>
                    </td>
                    <td>{data.entryDate}</td>
                    <td>{data.releaseDate ? data.releaseDate : "-"}</td>
                    <td className="text-center">
                      <div className="btn-group">
                        <div className="d-inline-block mx-1">
                          <img
                            title="Voir le rapport"
                            onClick={(e) => {
                              //e.preventDefault();
                              //setDelete(["" + data.employeeReference]);
                              // viewCompteRendu(data.id);
                              goToDetail(e, data.hospitalRecordId);
                            }}
                            src={view}
                            alt=""
                          />
                        </div>
                        {0 === 0 && (
                          <>
                            <div className="d-inline-block mx-1">
                              <img
                                title="Éditer le rapport"
                                data-bs-target="#create"
                                data-bs-toggle="modal"
                                onClick={(e) => {
                                  setEditData(e, data);
                                }}
                                src={edit}
                                alt=""
                              />
                            </div>
                            <div className="d-inline-block mx-1">
                              <img
                                title="Supprimer le rapport"
                                data-bs-target="#deleteModal"
                                data-bs-toggle="modal"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setDeleteId(data.hospitalRecordId);
                                }}
                                src={del}
                                alt=""
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Loading>

      <div className="modal fade" id="create">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim">
                Ajouter une nouvelle hospitalisation
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
                    type={"text"}
                    name={"motifHospitalisation"}
                    label={"Motif"}
                    placeholder={"Entrer le motif"}
                    formik={formik}
                  />
                  <Input
                    type={"text"}
                    name={"historyDisease"}
                    label={"Histoire de la maladie"}
                    placeholder={"Entrer history Disease"}
                    formik={formik}
                  />
                  <Input
                    type={"text"}
                    name={"examClinic"}
                    label={"Examen clinique"}
                    placeholder={"Entrer l'examClinic"}
                    formik={formik}
                  />
                  <Input
                    type={"text"}
                    name={"conclusion"}
                    label={"Conclusion"}
                    placeholder={"Entrer la conclusion"}
                    formik={formik}
                  />
                  <Input
                    type={"date"}
                    name={"entryDate"}
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
      <div className="modal fade" id="viewCompteRenduModal">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim">Compte rendu</h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <div dangerouslySetInnerHTML={{ __html: value }}></div>
            </div>
            <div className="modal-footer d-flex justify-content-start border-0">
              <button className="btn btn-primary" data-bs-dismiss="modal">
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="notifyRef">
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

            <div className="modal-body">{modalNotifyMsg}</div>

            <div className="modal-footer border-0 d-flex justify-content-start">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={(e) => {
                  e.preventDefault();
                  setModalNotifyMsg("");
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="deleteModal">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Suppression du compte rendu
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body text-start">Comfirmer l'action</div>

            <div className="modal-footer border-0 d-flex justify-content-start">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={(e) => {
                  onDelete(deleteId);
                }}
              >
                Comfirmer
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
      <input
        type="hidden"
        ref={notifyRef}
        data-bs-toggle="modal"
        data-bs-target="#notifyRef"
        onClick={(e) => {
          e.preventDefault();
          setNotifyBg("");
        }}
      />
    </div>
  );
};

export default HospitalisationListe;
