import React, { useContext, useEffect, useRef, useState } from "react";
import back from "../../../assets/imgs/back.png";
import sui from "../../../assets/imgs/sui.png";
import view from "../../../assets/imgs/view.png";
import edit from "../../../assets/imgs/edit.png";
import del from "../../../assets/imgs/delete.png";
import user from "../../../assets/imgs/user.png";
import print from "../../../assets/imgs/print.png";
import profile from "../../../assets/imgs/profile.png";
import { useFormik } from "formik";
import requestAgenda from "../../../services/requestAgenda";
import { apiAgenda, apiMedical } from "../../../services/api";
import InputField from "../../../components/InputField";
import FormNotify from "../../../components/FormNotify";
import { AppContext } from "../../../services/context";
import requestDoctor from "../../../services/requestDoctor";
import DeleteModal from "../../../components/DeleteModal";
import { Link } from "react-router-dom";
import Loading from "../../../components/Loading";

const initData = {
  doctorUuid: "",
  period: "",
  hour: "",
  patientCni: "",
  detail: "",
};

const RendezVous = ({ setLocation }) => {
  const [datas, setDatas] = useState([]);
  const [search, setSearch] = useState("");
  const [stopLoad, setStopLoad] = useState(false);
  const [list, setList] = useState("");
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [modalNotifyMsg, setModalNotifyMsg] = useState("");
  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;
  const [doctor, setDoctor] = useState({
    startDate: "",
    endDate: "",
    list: [],
  });
  const [dateList, setDateList] = useState([])
  const [deleteId, setDeleteId] = useState("");
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
  const header = {
    headers: { Authorization: `${user.token}` },
  };
  const closeRef = useRef();
  const notifyRef = useRef();
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    setLocation(window.location.pathname);
    get();
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
  const get = () => {
    //configNotify("loading", "", "Ajout d’un nouvel(le) employé(e) en cours...");
    //console.log(jsData)
    requestDoctor
      .get(apiMedical.rendezVousListe + "/" + user.cni)
      .then((res) => {
        console.log(res.data);
        setStopLoad(true)
        setDatas(res.data);
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
  const getEnvetEmploye = (values) => {
    //configNotify("loading", "", "Ajout d’un nouvel(le) employé(e) en cours...");
    //console.log(jsData)
    requestAgenda
      .get(
        apiAgenda.eventEmploye +
          "/" +
          user.organisationRef +
          "?startDate=" +
          values.startDate +
          "&endDate=" +
          values.endDate
      )
      .then((res) => {
        console.log(res.data);
        setDoctor({
          ...doctor,
          list: res.data,
        });
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

  const handlesubmit = (values) => {
    configNotify("loading", "", "Ajout d’un nouvel rendez vous en cours...");
    //console.log(jsData)
    console.log(values);
    requestDoctor
      .post(
        apiMedical.rendezVous +
          "/" +
          user.organisationRef +
          "?startDate=" +
          values.startDate +
          "&endDate=" +
          values.endDate,
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
  const formik = useFormik({
    initialValues: initData,
    onSubmit: (values) => {
      values.patientCni = user.cni;
      values.startDate = doctor.startDate;
      values.endDate = doctor.endDate;
      handlesubmit(values);
    },
  });

  const formikDate = useFormik({
    initialValues: { startDate: "", endDate: "" },
    onSubmit: (values) => {
      getEnvetEmploye(values);
      doctor.startDate = values.startDate;
      doctor.endDate = values.endDate;
    },
  });
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
                //onSearch(e, search);
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
      <div className="modal fade" id="newMeet">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Ajout un rendez vous
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
              <form onSubmit={formik.handleSubmit} noValidate>
                <label htmlFor="lname" className="form-label">
                  Date de début
                </label>
                <InputField
                  type={"date"}
                  name={"startDate"}
                  formik={formikDate}
                />
                <label htmlFor="lname" className="form-label">
                  Date de fin
                </label>
                <InputField
                  type={"date"}
                  name={"endDate"}
                  formik={formikDate}
                />
                <button
                  className="btn btn-primary mb-3"
                  onClick={formikDate.handleSubmit}
                >
                  Valider
                </button>
                <br />
                <label htmlFor="lname" className="form-label">
                  Les docteur disponible (
                  {doctor.startDate + " - " + doctor.endDate})
                </label>

                <div className="col-md-12 mb-3">
                  <select
                    className="form-select"
                    name={"doctorUuid"}
                    value={formik.values["doctorUuid"]}
                    onChange={e =>{
                      formik.handleChange(e)
                      doctor.list.map(data => {
                        if(formik.values["doctorUuid"] === data.employeeReference){
                          setDateList(data.daysAvailable)
                        }
                      })
                    }}
                  >
                    <option>{"Séletionnez un docteur"}</option>
                    {doctor.list.map((data, idx) => (
                      <option key={"select2" + idx} value={data.employeeReference}>
                        {data.lastName + " " + data.firstName}
                      </option>
                    ))}
                  </select>
                </div>
                <label htmlFor="lname" className="form-label">
                  Entrer la période
                </label>
                <div className="col-md-12 mb-3">
                  <select
                    className="form-select"
                    name={"period"}
                    value={formik.values["period"]}
                    onChange={formik.handleChange}
                  >
                    <option>Entrer la période</option>
                    {dateList.map((data, idx) => (
                      <option key={"select3" + idx} value={data}>
                        {data}
                      </option>
                    ))}
                  </select>
                </div>
                <label htmlFor="lname" className="form-label">
                  Entrer l'heure
                </label>
                <InputField
                  type={"time"}
                  name={"hour"}
                  placeholder="Entrer l'heure"
                  formik={formik}
                />
                <label htmlFor="lname" className="form-label">
                  Entrer les détails
                </label>
                <InputField
                  type={"textarea"}
                  name={"detail"}
                  placeholder="Entrer les détails"
                  formik={formik}
                />
                <div className="modal-footer d-flex justify-content-start border-0">
                  <button
                    type="reset"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    ref={closeRef}
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal1"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Loading data={datas} stopLoad={stopLoad}>
      <div className="table-responsive-sm">
        <table className="table table-striped align-middle">
          <thead>
            <tr className="align-middle">
              <th scope="col" className="border-raduis-left">
                Practiciens
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
              return (
                <tr key={idx}>
                  <td>
                    <div className="d-inline-block me-2 align-middle">
                      <img src={user} alt="" />
                    </div>
                    <div className="d-inline-block align-middle">
                      <span className="text-bold">Dr. {data.doctor}</span>
                      <br />
                      <span>{data.specialityDoctor}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-bold">{data.period}</span>
                    <br />
                    <span>
                      <span className="text-bold">Heure:</span> {data.hour}
                    </span>
                  </td>
                  <td>
                    {data.status === "Terminer" ? (
                      <button className="btn bg-success border-radius-2">
                        Terminer
                      </button>
                    ) : data.status === "En attente" ? (
                      <button className="btn bg-warning border-radius-2">
                        En attente
                      </button>
                    ) : (
                      <button className="btn bg-danger border-radius-2">
                        Annuler
                      </button>
                    )}
                  </td>
                  <td className="text-center">
                    <div className="btn-group">
                      <div className="d-inline-block mx-1">
                        <img
                          title="Voir le patient"
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
                            title="Supprimer le patient"
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
      <DeleteModal
        title={"Suppression du rendez vous"}
        modal={"deleteRendezVous"}
        id={deleteId}
        onDelete={onDelete}
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
                  <img width="100px" src={profile} alt="" />
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
                  <span className="text-bold text-meduim">{detail.hour}</span>
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
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Confirmer le rendez-vous
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RendezVous;
