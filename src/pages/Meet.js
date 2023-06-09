import React, { useContext, useEffect, useRef, useState } from "react";
import view from "../assets/imgs/view.png";
import edit from "../assets/imgs/edit.png";
import del from "../assets/imgs/delete.png";
import back from "../assets/imgs/back.png";
import sui from "../assets/imgs/sui.png";
import userProfile from "../assets/imgs/userinfo.png";
import userp from "../assets/imgs/profile.png";
import requestEmploye from "../services/requestEmploye";
import { apiAgenda, apiEmploye, apiMedical } from "../services/api";
import FormNotify from "../components/FormNotify";
import { AppContext } from "../services/context";
import { getUser } from "../services/storage";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import { useFormik } from "formik";
import requestAgenda from "../services/requestAgenda";
import requestDoctor from "../services/requestDoctor";
import DeleteModal from "../components/DeleteModal";
import Loading from "../components/Loading";

const initStatus = {
  WAIT: "En attente",
  CONFIRM: "Confirmé",
  CANCEL: "Annulé",
  END: "Terminé",
};
const Meet = () => {
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState("");
  const [stopLoad, setStopLoad] = useState(false);
  const [datas, setDatas] = useState([]);
  const [detail, setDetail] = useState({
    doctor: "",
    specialityDoctor: "",
    period: "",
    status: "",
    patient: "",
    hour: "",
    numberPatient: "",
    detail: "",
  });
  const [status, setStatus] = useState({
    id: "",
    value: "",
  });
  const [list, setList] = useState([]);

  const [deleteId, setDeleteId] = useState("");
  const [modalNotifyMsg, setModalNotifyMsg] = useState("");

  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [formValidate, setFormValidate] = useState("needs-validation");

  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;
  const [fail, setFail] = useState(false)
  let navigate = useNavigate();
  const header = {
    headers: { Authorization: `${user.token}` },
  };
  const notifyRef = useRef();

  useEffect(() => {
    //setList([...Array(12).keys()]);
    onUserChange(getUser());
    isAuth();
    get();
  }, [refresh]);
  const isAuth = () => {
    if (user.isAuth === false || user.token === null || user.token === "") {
      console.log(`connexion échoué, isAuth`);
      console.log(user);

      return navigate("/");
    }
  };

  const statusRendezVous = (e) => {
    e.preventDefault();
    requestDoctor
      .put(
        apiMedical.statusRendezVous +
          "/" +
          status.id +
          "?appointmentStatus=" +
          status.value,
        header
      )
      .then((res) => {
        
        get()
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
    //configNotify("loading", "", "Ajout d’un nouvel(le) employé(e) en cours...");
    //console.log(jsData)
    requestDoctor
      .get(apiMedical.rendezVousDoctor + "/" + user.organisationRef, header)
      .then((res) => {
        setStopLoad(true)
        setDatas(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
        setStopLoad(true)
        setFail(true)
      });
  };

  const getDetail = (id) => {
    requestDoctor
      .get(apiMedical.getRendezVous + "/" + id, header)
      .then((res) => {
        setDetail(res.data);
        console.log(res.data);
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
  const onDelete = (id) => {
    requestDoctor
      .delete(apiMedical.deleteRendezVous + "/" + id, header)
      .then((res) => {
        setModalNotifyMsg("Suppression réussie !");
        notifyRef.current.click();
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  const fValidate = (cl) => {
    setFormValidate(cl);
  };

  const configNotify = (bg, title, message) => {
    setNotifyBg(bg);
    setNotifyTitle(title);
    setNotifyMessage(message);
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
        <h1 className="h2">Mes Rendez-vous</h1>
      </div>

      <div className="row my-4">
        <div className="col-12">
          <div className="d-inline-block">
            <input
              type="text"
              className="form-control search"
              placeholder="Rechercher par le nom, le prénom..."
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
      </div>
      <Loading data={datas} stopLoad={stopLoad} fail={fail}>
      <div className="table-responsive-sm">
        <table className="table table-striped align-middle">
          <thead>
            <tr className="align-middle">
              <th scope="col" className="border-raduis-left">
                Patients
              </th>
              <th scope="col">Date et heure</th>
              <th scope="col">Statut</th>
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
                    <div className="d-inline-block me-2 align-middle">
                      <img src={user} alt="" />
                    </div>
                    <div className="d-inline-block align-middle">
                      <span className="text-bold">{data.patient}</span>
                      <br />
                    </div>
                  </td>
                  <td>
                    <span className="text-bold">{data.period}</span>
                    <br />
                    <span>
                      <span className="text-bold">Heure:</span> {data.startHour}
                    </span>
                  </td>
                  <td>
                    <div
                      data-bs-toggle="modal"
                      data-bs-target="#statusRendezVous"
                      onClick={(e) => {
                        setStatus({
                          ...status,
                          id: data.uuid,
                        });
                      }}
                    >
                      {data.status === "Terminer" && (
                        <button className="btn bg-success border-radius-2">
                          Terminé
                        </button>
                      )}
                      {data.status === "En attente" && (
                        <button className="btn bg-warning border-radius-2">
                          En attente
                        </button>
                      )}
                      {data.status === "Annuler" && (
                        <button className="btn bg-danger border-radius-2">
                          Annulé
                        </button>
                      )}
                      {data.status === "Confirmer" && (
                        <button className="btn bg-info border-radius-2">
                          Confirmé
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="btn-group">
                      <div className="d-inline-block mx-1">
                        <img
                          title="Voir le rendez vous"
                          data-bs-toggle="modal"
                          data-bs-target="#detailRendezVous"
                          onClick={(e) => {
                            e.preventDefault();
                            getDetail(data.uuid);
                          }}
                          src={view}
                          alt=""
                        />
                      </div>
                      {0 === 0 && (
                        <div className="d-inline-block mx-1">
                          <img
                            title="Supprimer le rendez vous"
                            data-bs-toggle="modal"
                            data-bs-target="#deleteRendezVous"
                            onClick={(e) => {
                              e.preventDefault();
                              setDeleteId(data.uuid);
                              //setDelete(["" + data.employeeReference]);
                            }}
                            src={del}
                            alt=""
                          />
                        </div>
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
      <DeleteModal
        title={"Suppression du rendez vous"}
        modal={"deleteRendezVous"}
        id={deleteId}
        onDelete={onDelete}
      />
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
          setNotifyBg("");
        }}
      />
      <div className="modal fade" id="detailRendezVous">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Information de la consultation
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col-3 col-sm-2">
                  <img width="100px" src={userp} alt="" />
                </div>
                <div className="col-9 col-sm-10 py-2">
                  <div className="d-flex justify-content-between">
                    <span className="text-bold text-meduim">
                      {/*eventList[indexEvent] && eventList[indexEvent].title*/}
                      {detail.patient}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-bold">
                      {/*eventList[indexEvent] && eventList[indexEvent].title*/}
                      (00226) {detail.numberPatient}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-bold">
                      {/*eventList[indexEvent] && eventList[indexEvent].title*/}
                      johndoe@example.com
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="">
                      {/*eventList[indexEvent] && eventList[indexEvent].title*/}
                      <Link to="#" className="text-black">
                        Dossier patient
                      </Link>
                    </span>
                  </div>
                </div>
                <div className="col-12 pt-3 ">
                  <span className="text-bold">Date de consultation: </span>
                  <span className="text-bold text-meduim">{detail.period}</span>
                  <br />
                  <span className="text-bold">Heure:</span>
                  <span className="text-bold text-meduim">{detail.startHour}</span>
                </div>

                <div className="col-12 pt-3 ">
                  <span className="text-bold text-underline">Détails</span>
                  <hr className="mt-0" />
                </div>
              </div>
              {detail.detail}
            </div>

            <div className="modal-footer border-0 d-flex justify-content-start">
              
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="statusRendezVous">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Statut de la consultation
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col-md-12 mb-3">
                  <select
                    className="form-select"
                    name={"doctorUuid"}
                    value={status.value}
                    onChange={(e) => {
                      e.preventDefault();
                      setStatus({
                        ...status,
                        value: e.target.value,
                      });
                    }}
                  >
                    <option>{"Sélectionnez un statut"}</option>
                    {Object.keys(initStatus).map((key, idx) => (
                      <option key={"select2" + idx} value={key}>
                        {initStatus[key]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer border-0 d-flex justify-content-start">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={statusRendezVous}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Meet;
