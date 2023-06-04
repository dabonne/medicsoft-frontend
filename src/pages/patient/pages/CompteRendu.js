import React, { useContext, useEffect, useRef, useState } from "react";
import back from "../../../assets/imgs/back.png";
import sui from "../../../assets/imgs/sui.png";
import view from "../../../assets/imgs/view.png";
import edit from "../../../assets/imgs/edit.png";
import del from "../../../assets/imgs/delete.png";
import user from "../../../assets/imgs/user.png";
import print from "../../../assets/imgs/print.png";
import { Route, Routes, useLocation } from "react-router-dom";
import Dossier from "../components/DossierMedicaux";
import AntecedentPersonnel from "../components/AntecedentPersonnel";
import { useFormik } from "formik";
import FormNotify from "../../../components/FormNotify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import requestPatient from "../../../services/requestPatient";
import { apiMedical } from "../../../services/api";
import { AppContext } from "../../../services/context";
import Loading from "../../../components/Loading";

const CompteRendu = ({ setLocation }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [search, setSearch] = useState("");
  const [stopLoad, setStopLoad] = useState(false);
  const [list, setList] = useState("");
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
  const header = {
    headers: { Authorization: `${user.token}` },
  };

  useEffect(() => {
    get();
    setLocation(window.location.pathname);
  }, [refresh]);

  const onSearch = (e) => {
    e.preventDefault();
    let str = e.target.value;
    let dd = datas.filter((data) => {
      const fullNameOne = data.lastName + " " + data.firstName;
      const fullNameTwo = data.firstName + " " + data.lastName;
      const fullNameOneDepart =
        data.lastName + " " + data.firstName + " " + data.department;
      const fullNameTwoDepart =
        data.firstName + " " + data.lastName + " " + data.department;

      return (
        data.lastName.toLowerCase().includes(str.toLowerCase()) ||
        data.firstName.toLowerCase().includes(str.toLowerCase()) ||
        data.department.toLowerCase().includes(str.toLowerCase()) ||
        fullNameOne.toLowerCase().includes(str.toLowerCase()) ||
        fullNameTwo.toLowerCase().includes(str.toLowerCase()) ||
        fullNameOneDepart.toLowerCase().includes(str.toLowerCase()) ||
        fullNameTwoDepart.toLowerCase().includes(str.toLowerCase())
      );
    });

    dd !== [] ? setList(dd) : setList(datas);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    configNotify("loading", "", "Ajout des données en cours...");
    console.log(value);
    requestPatient
      .post(
        apiMedical.postReport + "/" + user.organisationRef,
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
    requestPatient
      .get(apiMedical.getReport + "/" + user.cni, header)
      .then((res) => {
        console.log(res.data);
        setStopLoad(true)
        setDatas(res.data);
      })
      .catch((error) => {
        console.log(error);
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
    requestPatient
      .delete(apiMedical.deleteReport + "/" + id)
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
                onSearch(e, search);
              }}
            />
          </div>
          <div className="btn-group">
            <div className="d-inline-block my-1 mx-1">
              <img src={back} alt="" />
            </div>
            <div className="d-inline-block my-1 mx-1">
              <img src={sui} alt="" />
            </div>
          </div>
          <div className="d-inline-block my-1 mx-1 text-meduim text-bold">
            1/10
          </div>
        </div>
        <div className="col-3 d-flex justify-content-end align-items-center">
          <button
            className="btn btn-primary"
            data-bs-target="#compteRenduModal"
            data-bs-toggle="modal"
            onClick={(e) => setValue("")}
          >
            Ajouter
          </button>
        </div>
      </div>

      <Loading data={datas} stopLoad={stopLoad}>
      <div className="table-responsive-lg">
        <table className="table table-striped align-middle">
          <thead>
            <tr className="align-middle">
              <th scope="col" className="border-raduis-left">
                Rapport ID
              </th>
              <th scope="col">Date d’édition</th>
              <th scope="col">Editer par</th>
              <th scope="col" className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {datas.map((data, idx) => {
              //data.checkValue = false
              return (
                <tr key={idx}>
                  <td>
                    <span className="text-bold">RAPP-0218374</span>
                  </td>
                  <td>
                    <span className="text-bold">{data.editDate}</span>
                  </td>
                  <td>
                    <div className="d-inline-block me-2 align-middle">
                      <img src={user} alt="" />
                    </div>
                    <div className="d-inline-block align-middle">
                      <span className="text-bold">{data.editBy}</span>
                      <br />
                      <span>Psychiatre</span>
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="btn-group">
                      <div className="d-inline-block mx-1">
                        <img
                          title="Voir le rapport"
                          data-bs-toggle="modal"
                          data-bs-target="#viewCompteRenduModal"
                          onClick={(e) => {
                            e.preventDefault();
                            //setDelete(["" + data.employeeReference]);
                            viewCompteRendu(data.id);
                          }}
                          src={view}
                          alt=""
                        />
                      </div>
                      <div className="d-inline-block mx-1">
                        <img
                          title="Imprimer le rapport"
                          onClick={(e) => {
                            e.preventDefault();
                            //setDelete(["" + data.employeeReference]);
                            //viewEmploye(data);
                            //window.location.href=apiMedical.printReport+"/"+data.id
                            window.open(
                              "https://doctor-management.herokuapp.com/doctor-management/external-api/doctor/medical-record/report/" +
                                data.id+"/"+user.organisationRef
                            );
                          }}
                          src={print}
                          alt=""
                        />
                      </div>
                      {0 === 0 && (
                        <>
                          <div className="d-inline-block mx-1">
                            <img
                              title="Éditer le rapport"
                              data-bs-target="#compteRenduModal"
                              data-bs-toggle="modal"
                              onClick={(e) => {
                                e.preventDefault();
                                viewCompteRendu(data.id);
                                setEditMode(data.id);
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
                                setDeleteId(data.id);
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

      <div className="modal fade" id="compteRenduModal">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim">
                Ajouter un compte rendu
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
              <form
                className={"mt-3"}
                onSubmit={editMode !== "" ? handleEditSubmit : handleSubmit}
              >
                <div className="mb-5">
                  <ReactQuill
                    theme="snow"
                    value={value}
                    onChange={setValue}
                    style={{ height: "200px" }}
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

export default CompteRendu;
