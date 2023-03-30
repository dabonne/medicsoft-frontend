import React, { useContext, useEffect, useRef, useState } from "react";
import back from "../../../assets/imgs/back.png";
import sui from "../../../assets/imgs/sui.png";
import view from "../../../assets/imgs/view.png";
import edit from "../../../assets/imgs/edit.png";
import del from "../../../assets/imgs/delete.png";
import user from "../../../assets/imgs/user.png";
import print from "../../../assets/imgs/print.png";
import { useFormik } from "formik";
import requestAgenda from "../../../services/requestAgenda";
import { apiAgenda, apiMedical } from "../../../services/api";
import InputField from "../../../components/InputField";
import FormNotify from "../../../components/FormNotify";
import { AppContext } from "../../../services/context";
import requestDoctor from "../../../services/requestDoctor";

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
  const [list, setList] = useState("");
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [modalNotifyMsg, setModalNotifyMsg] = useState("");
  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;
  const doctors = [
    { name: "Sawadogo Jean Brice", sp: "Pediatre" },
    { name: "Coulibaly Philippe", sp: "Psychiatre" },
    { name: "Dembele Hoda", sp: "Cardiologue" },
    { name: "Bazongo Bonou", sp: "Pediatre" },
  ];
  const [doctor, setDoctor] = useState({
    startDate: "",
    endDate: "",
    list: [],
  });
  const header = {
    headers: { Authorization: `${user.token}` },
  };
  const closeRef = useRef()
  const notifyRef = useRef();
  useEffect(() => {
    setLocation(window.location.pathname);
    get()
  }, []);

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
      .get(
        apiMedical.rendezVousListe +
          "/" +
          user.cni
      )
      .then((res) => {
        console.log(res.data);
        setDatas(res.data)
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
          "Ouppss!!",
          "Une erreur est survenue, veuillez reesayer plus tard..."
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
          "Ouppss!!",
          "Une erreur est survenue, veuillez reesayer plus tard..."
        );
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
        <div className="col-3 d-flex justify-content-end align-items-center">
          <button
            className="btn btn-primary"
            data-bs-target="#newMeet"
            data-bs-toggle="modal"
            onClick={(e) => {
              //setModalView("");
            }}
          >
            Ajouter
          </button>
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
                <InputField
                  type={"select2"}
                  name={"doctorUuid"}
                  placeholder="Séletionnez un docteur"
                  formik={formik}
                  options={doctor.list}
                />
                <label htmlFor="lname" className="form-label">
                  Entrer la période
                </label>
                <InputField
                  type={"date"}
                  name={"period"}
                  placeholder="Entrer la période"
                  formik={formik}
                />
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
                      <span>Pediatre</span>
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
                          data-bs-target="#viewEmploye"
                          onClick={(e) => {
                            e.preventDefault();
                            //setDelete(["" + data.employeeReference]);
                            //viewEmploye(data);
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
                            data-bs-target="#deleteEmploye"
                            onClick={(e) => {
                              e.preventDefault();
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
    </div>
  );
};

export default RendezVous;
