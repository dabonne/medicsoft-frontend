import React, { useContext, useEffect, useRef, useState } from "react";
import view from "../assets/imgs/view.png";
import edit from "../assets/imgs/edit.png";
import del from "../assets/imgs/delete.png";
import back from "../assets/imgs/back.png";
import sui from "../assets/imgs/sui.png";
import { apiDrug, apiEmploye, apiOrganisation, apiUser } from "../services/api";
import FormNotify from "../components/FormNotify";
import { AppContext, initialUser } from "../services/context";
//import Select from "react-select";
import { deleteUser } from "../services/storage";
import Loading from "../components/Loading";
import { matrice } from "../services/service";
import requestExternal from "../services/requestExternal";
import { useFormik } from "formik";
import Input from "../components/Input";
import requestOrganisation from "../services/requestOrganisation";

const initData = {
  familleId: "",
  abbreviation: "",
  libelle: "",
};
const Protocole = () => {
  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState("");
  const [stopLoad, setStopLoad] = useState(false);
  const [dele, setDelete] = useState([]);
  const [datas, setDatas] = useState([]);
  const [list, setList] = useState([]);
  const [jsData, setJsData] = useState({
    registrationReference: "",
    firstName: "",
    lastName: "",
    cnib: "",
    title: "",
    birthdate: "",
    specialisation: "",
    specialisations: {},
    classification: "",
    classifications: {},
    email: "",
    phone: "",
    doctorNationalId: "",
    medicalStaff: "",
  });

  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [formValidate, setFormValidate] = useState("needs-validation");
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [modalNotifyMsg, setModalNotifyMsg] = useState("");
  const [fail, setFail] = useState(false);
  const [pagination, setPagination] = useState([]);
  const header = {
    headers: {
      Authorization: `Bearer ${user.token}`,
      ///"Content-Type": "multipart/form-data",
    },
  };
  const closeRef = useRef();
  const closeEditRef = useRef();
  const notifyRef = useRef();

  const [formType, setFormType] = useState("simple");
  const [viewData, setViewData] = useState({});
  const [organisations, setOrganisations] = useState([]);
  const [organisationId, setOrganisationId] = useState("");

  useEffect(() => {
    get();
  }, [refresh]);

  const formik = useFormik({
    initialValues: initData,
    onSubmit: (values) => {
      console.log(values);
      if (values.uuid) {
        update(values);
      } else {
        if (formType === "simple") {
          post(values);
        } else {
          postFile(values);
        }
      }
    },
  });

  const get = () => {
    requestExternal
      .get(apiDrug.settings + "/" + user.organisationRef + "/protocoles", header)
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

          setDatas([]);
          setList([]);
          setTotalPage([]);
        }
      })
      .catch((error) => {
        //deconnect()
        //console.log(error)
        setStopLoad(true);
        setFail(true);
      });
  };

  const post = (values) => {
    configNotify("loading", "", "Ajout d’un nouvel(le) employé(e) en cours...");
    console.log(jsData);
    requestExternal
      .post(
        apiDrug.settings + "/" + user.organisationRef + "/protocoles",
        values,
        header
      )
      .then((res) => {
        console.log("enregistrement ok");
        setRefresh(refresh + 1);
        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );
        setModalNotifyMsg("Le médicament a été ajouté avec succès");
        closeRef.current.click();
        notifyRef.current.click();
        get();
      })
      .catch((error) => {
        console.log(error);
        configNotify(
          "danger",
          "Ouppss!!",
          "Une erreur est survenue, veuillez reesayer plus tard..."
        );
      });
  };

  const postFile = (values) => {
    configNotify(
      "loading",
      "",
      "Ajout d’une nouvelle liste de médicament en cours..."
    );
    const configHeader = {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    requestExternal
      .post(apiDrug.settings+"/"+user.organisationRef+"/import-protocoles", values, configHeader)
      .then((res) => {
        console.log("enregistrement ok");
        setRefresh(refresh + 1);
        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );
        setModalNotifyMsg("Le médicament a été ajouté avec succès");
        closeRef.current.click();
        notifyRef.current.click();
        get();
      })
      .catch((error) => {
        console.log(error);
        configNotify(
          "danger",
          "Ouppss!!",
          "Une erreur est survenue, veuillez reesayer plus tard..."
        );
      });
  };

  const update = (values) => {
    configNotify("loading", "", "Modification du médicament en cours...");
    requestExternal
      .put(apiDrug.settings + "/" + organisationId + "/protocoles",
      values,
      header)
      .then((res) => {
        console.log("enregistrement ok");
        setRefresh(refresh + 1);
        configNotify(
          "success",
          "Modification réussi",
          "Les informations ont été enrégistrées"
        );
        closeEditRef.current.click();
        setModalNotifyMsg("Les informations ont été modifiées");

        notifyRef.current.click();
      })
      .catch((error) => {
        console.log(error);
        configNotify(
          "danger",
          "Ouppss!!",
          "Une erreur est survenue, veuillez reesayer plus tard..."
        );
      });
  };

  const dataSeleted = (data) => {
    console.log(data);
    setViewData(data);
  };
  const setEditData = (e, data) => {
    e.preventDefault();
    formik.setFieldValue("abbreviation", data.abbreviation);
    formik.setFieldValue("libelle", data.libelle);
    formik.setFieldValue("familleId", data.famille);
    formik.setFieldValue("uuid", data.protocoleId);
  };
  const onDelete = (e) => {
    e.preventDefault();
    requestExternal
      .delete(apiDrug.settings + "/protocoles/" + viewData.protocoleId)
      .then((res) => {
        console.log("suppression ok");
        setModalNotifyMsg("Suppression réussie !");
        notifyRef.current.click();
        setDelete([]);
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteList = (data) => {
    if (data.checkValue === undefined || data.checkValue === false) {
      data.checkValue = true;
      setDelete([...dele, data.employeeReference]);
    } else {
      data.checkValue = false;
      const list = dele.filter(function (ref) {
        return ref !== data.employeeReference;
      });
      setDelete(list);
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    let str = e.target.value;
    let dd = datas.filter((data) => {
      const fullNameOne = data.abbreviation + " " + data.libelle;
      const fullNameTwo = data.libelle + " " + data.abbreviation;

      return (
        data.libelle.toLowerCase().includes(str.toLowerCase()) ||
        data.abbreviation.toLowerCase().includes(str.toLowerCase()) ||
        data.famille.toLowerCase().includes(str.toLowerCase()) ||
        fullNameOne.toLowerCase().includes(str.toLowerCase()) ||
        fullNameTwo.toLowerCase().includes(str.toLowerCase())
      );
    });

    dd.length !== 0 ? setList(dd) : setList(datas);
  };

  const fValidate = (cl) => {
    setFormValidate(cl);
  };

  const configNotify = (bg, title, message) => {
    setNotifyBg(bg);
    setNotifyTitle(title);
    setNotifyMessage(message);
  };

  const deconnect = () => {
    deleteUser();
    onUserChange(initialUser);
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

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
        <h1 className="h2">Gestion des protocoles</h1>
        <div className="btn-toolbar">
          <button
            className="btn btn-primary"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#create"
            onClick={(e) => {
              e.preventDefault();
              formik.resetForm();
            }}
          >
            +
          </button>
        </div>
      </div>
      <div className="modal fade" id="create">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                {formik.values["uuid"] !== undefined
                  ? "Modification d'un protocole"
                  : "Ajouter un protocole"}
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              {notifyBg != "" ? (
                <FormNotify
                  bg={notifyBg}
                  title={notifyTitle}
                  message={notifyMessage}
                />
              ) : null}
              <form
                className={formValidate}
                onSubmit={formik.handleSubmit}
                noValidate
              >
                {formik.values["uuid"] === undefined && (
                  <div className="d-flex mb-3">
                    <span
                      className="btn btn-primary me-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setFormType("simple");
                      }}
                    >
                      Ajout simple
                    </span>
                    <span
                      className="btn btn-primary me-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setFormType("fichier");
                      }}
                    >
                      Ajout multiple
                    </span>
                  </div>
                )}

                {formType === "simple" ? (
                  <>
                    <Input
                      type={"text"}
                      name={"abbreviation"}
                      label={"Abbreviation"}
                      placeholder={"Entrer l'abbreviation du protocole"}
                      formik={formik}
                    />
                    <Input
                      type={"text"}
                      name={"libelle"}
                      label={"Libelle"}
                      placeholder={"Entrer le nom du protocole"}
                      formik={formik}
                    />
                    <Input
                      type={"text"}
                      name={"familleId"}
                      label={"Libelle"}
                      placeholder={"Entrer le nom du protocole"}
                      formik={formik}
                    />
                  </>
                ) : (
                  <>
                    <Input
                      type={"file"}
                      name={"file"}
                      label={"Fichier excel des médicaments"}
                      placeholder={"Sélectionnez le fichier excel"}
                      formik={formik}
                    />
                  </>
                )}

                <div className="modal-footer d-flex justify-content-start border-0">
                  <button
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    ref={closeRef}
                    onClick={(e) => {
                      e.preventDefault();
                      fValidate("needs-validation");
                    }}
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => fValidate("was-validated")}
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="delete">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Supprimer le protocole
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">Comfirmer l'action</div>

            <div className="modal-footer border-0 d-flex justify-content-start">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={(e) => {
                  onDelete(e);
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
      <div className="modal fade" id="view">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Information du protocole
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div className="row">
                {/**
                 * <div className="col-3">
                  <img src={userProfile} alt="" />
                </div>
                 */}
                <div className="col-9">
                  <div className="d-flex justify-content-between">
                    <span>Abbreviation:</span>
                    <span className="text-bold">{viewData.abbreviation}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Libelle:</span>
                    <span className="text-bold">{viewData.libelle}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Famille:</span>
                    <span className="text-bold">{viewData.famille}</span>
                  </div>
                </div>
                <div className="modal-footer border-0 d-flex justify-content-start">
                  <button
                    type="button"
                    className="btn btn-primary ms-auto"
                    data-bs-dismiss="modal"
                  >
                    Fermer
                  </button>
                </div>
              </div>
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

      <div className="row my-4">
        <div className="col-12">
          <div className="d-inline-block">
            <input
              type="text"
              className="form-control search"
              placeholder="Rechercher par l'abbreviation, libelle ou la famille..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onSearch(e, search);
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
      </div>
      <div className="d-flex align-items-center mb-3">
        <p className="text-ultra-small me-auto">
          {list.length} éléments affichés
        </p>
        <div className="">
          <select className="form-select" value={organisationId} onChange={e => {
            setOrganisationId(e.target.value)
            get(e.target.value)
          }}>
            <option selected>Sélectionnez une organisation</option>
            {organisations.map((data) => {
              return (
                <option value={data.registrationReference}>
                  {data.organisationName}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <Loading data={list} stopLoad={stopLoad} fail={fail}>
        <div className="table-responsive-sm">
          <table className="table table-striped align-middle">
            <thead>
              <tr className="align-middle">
                <th scope="col" className="border-raduis-left">
                  #
                </th>
                <th scope="col">Abbreviation</th>
                <th scope="col">Libelle</th>
                <th scope="col">Famille</th>
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
                      <input
                        type="checkbox"
                        value="seleted"
                        onChange={() => {
                          deleteList(data);
                        }}
                      />
                    </td>
                    <td>{data.abbreviation}</td>
                    <td>{data.libelle}</td>
                    <td>{data.famille}</td>
                    <td className="text-center">
                      <div className="btn-group">
                        <div className="d-inline-block mx-1">
                          <img
                            title="Voir l'employé"
                            data-bs-toggle="modal"
                            data-bs-target="#view"
                            onClick={(e) => {
                              e.preventDefault();
                              //setDelete(["" + data.employeeReference]);
                              dataSeleted(data);
                            }}
                            src={view}
                            alt=""
                          />
                        </div>
                        <div className="d-inline-block mx-1">
                          <img
                            title="Éditer l'employé"
                            data-bs-toggle="modal"
                            data-bs-target="#create"
                            onClick={(e) => {
                              //getEmploye(e, data.employeeReference);
                              setEditData(e, data);
                            }}
                            src={edit}
                            alt=""
                          />
                        </div>
                        <div className="d-inline-block mx-1">
                          <img
                            title="Supprimer l'employé"
                            data-bs-toggle="modal"
                            data-bs-target="#delete"
                            onClick={(e) => {
                              e.preventDefault();
                              setDelete(["" + data.protocoleId]); //a supprimer
                              dataSeleted(data);
                            }}
                            src={del}
                            alt=""
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Loading>
      <div className="d-inline-block my-1 me-1">
        <img
          title="Supprimer les employés selectionnés"
          data-bs-toggle="modal"
          data-bs-target="#deleteEmploye"
          src={del}
          alt=""
        />
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
    </>
  );
};

export default Protocole;
