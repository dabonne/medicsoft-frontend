import React, { useContext, useEffect, useRef, useState } from "react";
import back from "../../../assets/imgs/back.png";
import sui from "../../../assets/imgs/sui.png";
import view from "../../../assets/imgs/view.png";
import edit from "../../../assets/imgs/edit.png";
import del from "../../../assets/imgs/delete.png";
import user from "../../../assets/imgs/user.png";
import print from "../../../assets/imgs/print.png";

import { apiHospitalisation, apiMedical } from "../../../services/api";
import { AppContext } from "../../../services/context";
import DeleteModal from "../../../components/DeleteModal";
import Loading from "../../../components/Loading";
import requestDoctor from "../../../services/requestDoctor";
import { matrice, onSearch } from "../../../services/service";
import requestHospitalisation from "../../../services/requestHospitalisation";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import Input from "../../../components/Input";
import FormNotify from "../../../components/FormNotify";

const initData = {
  date: "",
  label: "",
  isDossierSynthese: "",
};

const ObservationHospi = ({ setNameIdx = () => {}, type = {} }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [search, setSearch] = useState("");
  const [stopLoad, setStopLoad] = useState(false);
  const [list, setList] = useState([]);
  const [editValue, setEditValue] = useState();
  const [refresh, setRefresh] = useState(0);
  const notify = useRef();
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [dataView, setDataView] = useState({});
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [modalNotifyMsg, setModalNotifyMsg] = useState("");

  const [formValidate, setFormValidate] = useState("needs-validation");
  const header = {
    headers: {
      Authorization: `${user.token}`,
    },
  };

  const [fail, setFail] = useState(false);
  const { id } = useParams();
  const closeRef = useRef();
  const notifyRef = useRef();

  setNameIdx(1);
  useEffect(() => {
    console.log(type);
    get();
  }, [refresh]);

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

  const get = () => {
    requestHospitalisation
      .get(
        apiHospitalisation.hospitalRecords + "/" + id + "/observations",
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
  const post = (values) => {
    console.log(values);
    requestHospitalisation
      .post(
        apiHospitalisation.hospitalRecords + "/" + id + "/observations",
        values,
        header
      )
      .then((res) => {
        console.log("enregistrement ok");
        formik.resetForm()
        setRefresh(refresh + 1);
        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );
        setModalNotifyMsg("L'observation a été ajouté avec succès");
        closeRef.current.click();
        notifyRef.current.click();
        get();
      })
      .catch((error) => {
        console.log(error);
        setStopLoad(true);
        setFail(true);
      });
  };
  const update = (values) => {
    requestHospitalisation
      .put(
        apiHospitalisation.hospitalRecords +
          "/" +
          id +
          "/observations/" +
          values.uuid,
        values,
        header
      )
      .then((res) => {
        //console.log("enregistrement ok");
        formik.resetForm();
        setRefresh(refresh + 1);
        configNotify(
          "success",
          "Modification réussi",
          "Les informations ont été enrégistrées"
        );
        setModalNotifyMsg("Les informations ont été modifiées");
        closeRef.current.click();
        notifyRef.current.click();
        get();
      })
      .catch((error) => {
        console.log(error);
        setStopLoad(true);
        setFail(true);
      });
  };
  const makeSearch = (e) => {
    e.preventDefault();
    onSearch(e, setList, datas, [
      "antecedentLabel",
      "typeAntecedent",
      "cni",
      "detail",
    ]);
  };
  const onDelete = (deleteId) => {
    //e.preventDefault();
    console.log(id);
    requestHospitalisation
      .delete(
        apiHospitalisation.hospitalRecords +
          "/" +
          id +
          "/observations/" +
          deleteId
      )
      .then((res) => {
        console.log("suppression ok");
        get();
        setModalNotifyMsg("Suppression réussie !");
        notifyRef.current.click();
        //setDelete([]);
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
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

  const configNotify = (bg, title, message) => {
    setNotifyBg(bg);
    setNotifyTitle(title);
    setNotifyMessage(message);
  };

  const setIsDossierSynthese = (e, data) => {
    e.preventDefault();
    update({
      label: data.label,
      date: data.dateObservation,
      isDossierSynthese: !data.isDossierSynthese,
      uuid: data.observationId,
    });
  };

  const setEditData = (e, data) => {
    e.preventDefault();
    formik.setFieldValue("label", data.label);
    formik.setFieldValue("date", data.dateObservation);
    formik.setFieldValue("isDossierSynthese", data.isDossierSynthese);
    formik.setFieldValue("uuid", data.observationId);
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
        <div className="col-3 d-flex justify-content-end align-items-center">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target={"#create"}
          >
            Ajouter
          </button>
        </div>
      </div>

      <Loading data={datas} stopLoad={stopLoad} fail={fail}>
        <div className="table-responsive-lg">
          <table className="table table-striped align-middle">
            <thead>
              <tr className="align-middle">
                <th scope="col" className="border-raduis-left">
                  Observation ID
                </th>
                <th scope="col">Description</th>
                <th scope="col">Date</th>
                <th scope="col">Auteur</th>
                {/**<th scope="col">Etat</th> */}
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
                      <span className="text-bold">PRESC-0218374</span>
                    </td>
                    <td>
                      <span className="text-bold">{data.label}</span>
                    </td>
                    <td>{data.dateObservation}</td>
                    <td>{data.user}</td>
                    {
                      /**
                       * <td>
                      {data.isDossierSynthese
                        ? "Copier dans de le dossier synthèse"
                        : "Non copier dans le dossier synthèse"}
                    </td>
                       */
                    }
                    <td className="text-center">
                      <div className="btn-group">
                        <div className="d-inline-block mx-1">
                          <img
                            title="Voir le rendez vous"
                            data-bs-toggle="modal"
                            data-bs-target="#viewAtt"
                            onClick={(e) => {
                              e.preventDefault();
                              //getDetail(data.uuid);
                              setDataView(data);
                              //console.log(data);
                            }}
                            src={view}
                            alt=""
                          />
                        </div>
                        <div className="d-inline-block mx-1">
                          <img
                            title={
                              data.isDossierSynthese
                                ? "Retirer de la synthèse"
                                : "Ajouter à la synthèse"
                            }
                            onClick={(e) => setIsDossierSynthese(e, data)}
                            src={print}
                            alt=""
                          />
                        </div>
                        <div className="d-inline-block mx-1">
                          <img
                            title="Éditer les données"
                            data-bs-toggle="modal"
                            data-bs-target={"#create"}
                            onClick={(e) => {
                              setEditData(e, data);
                            }}
                            src={edit}
                            alt=""
                          />
                        </div>
                        <div className="d-inline-block mx-1">
                          <img
                            title="Supprimer les données"
                            data-bs-toggle="modal"
                            data-bs-target={"#deleteData" + data.observationId}
                            onClick={(e) => {
                              e.preventDefault();
                              //setDelete(["" + data.employeeReference]);
                              setEditValue(data);
                            }}
                            src={del}
                            alt=""
                          />
                        </div>
                        <DeleteModal
                          id={data.observationId}
                          modal={"deleteData" + data.observationId}
                          title={"Supprimer les données"}
                          data={editValue}
                          onDelete={onDelete}
                        />
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
              <h4 className="modal-title text-meduim text-bold">
                {formik.values["uuid"] !== undefined
                  ? "Modification d'une observation"
                  : "Ajouter une observation"}
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
                //className={formValidate}
                onSubmit={formik.handleSubmit}
                noValidate
              >
                <>
                  <Input
                    type={"date"}
                    name={"date"}
                    label={"Date"}
                    placeholder={"Entrer l'abbreviation du protocole"}
                    formik={formik}
                  />
                  <Input
                    type={"text"}
                    name={"label"}
                    label={"Détail"}
                    placeholder={"Entrer les détails"}
                    formik={formik}
                  />
                </>

                <div className="modal-footer d-flex justify-content-start border-0">
                  <button
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    ref={closeRef}
                    onClick={(e) => {
                      e.preventDefault();
                      //fValidate("needs-validation");
                    }}
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    //onClick={() => fValidate("was-validated")}
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
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
              <p className="p-0">
                {dataView.isDossierSynthese
                  ? "Copier dans de le dossier synthèse"
                  : "Non copier dans le dossier synthèse"}
              </p>
              <p className="p-0">
                <span className="fw-bold">Date</span> <br />
                <span>{dataView.dateObservation}</span>
              </p>
              <p className="p-0">
                <span className="fw-bold">Détails</span> <br />
                <div
                  className=""
                  dangerouslySetInnerHTML={{ __html: dataView.label }}
                />
              </p>
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
      <input
        type="hidden"
        ref={notifyRef}
        data-bs-toggle="modal"
        data-bs-target="#notifyRef"
        onClick={(e) => {
          e.preventDefault();
        }}
      />
    </div>
  );
};

export default ObservationHospi;
