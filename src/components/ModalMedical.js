import view from "../assets/imgs/view.png";
import add from "../assets/imgs/add.png";
import FormNotify from "./FormNotify";
import { useContext, useEffect, useRef, useState } from "react";
import requestPatient from "../services/requestPatient";
import { apiMedical, apiParamedical } from "../services/api";
import { AppContext } from "../services/context";

const initMedical = {
  patientCni: "",
  entitled: "",
  medicalType: "",
  dateElaborate: "",
  detail: "",
};

const ModalMedical = ({
  id,
  type,
  title,
  list = [],
  refresh = () => {},
  oldValue = { id: "", entitled: "", content: "" },
}) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [medical, setMedical] = useState(initMedical);
  const [entitled, setEntitled] = useState("");
  const [detail, setDetail] = useState("");
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [formValidate, setFormValidate] = useState("needs-validation");
  const [modalNotifyMsg, setModalNotifyMsg] = useState("");
  const closeRef = useRef();
  const closeEditRef = useRef();
  const notifyRef = useRef();
  const header = {
    headers: { Authorization: `${user.token}` },
  };

  useEffect(() => {
    if (oldValue.content !== "" || oldValue.entitled !== "") {
      initMedical.detail = oldValue.content;
      if (list.length !== 0) {
        list.map((data) => {
          if (data.label === oldValue.entitled) {
            setEntitled(data.uuid);
            initMedical.entitled = data.uuid;
          }
        });
      }else{
        setEntitled(oldValue.entitled);
        initMedical.entitled = oldValue.entitled;
      }

      setDetail(initMedical.detail);
    }
    //console.log(list )
    //console.log(list.length !== 0)
  }, [oldValue, list]);

  const handleSubmit = (e) => {
    e.preventDefault();
    initMedical.patientCni = user.cni;
    initMedical.medicalType = type;
    initMedical.dateElaborate = formatDate(new Date());
    initMedical.entitled = entitled;
    initMedical.detail = detail;
    console.log(initMedical);
    configNotify("loading", "", "Ajout des données en cours...");
    //console.log(jsData)
    requestPatient
      .post(apiMedical.post + "/" + user.organisationRef, initMedical, header)
      .then((res) => {
        console.log("enregistrement ok");

        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );
        setModalNotifyMsg("Les informations ont bien été enrégistrées");
        closeRef.current.click();
        notifyRef.current.click();
        refresh();
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
    initMedical.patientCni = user.cni;
    initMedical.medicalType = type;
    initMedical.dateElaborate = formatDate(new Date());
    initMedical.entitled = entitled;
    initMedical.detail = detail;
    console.log(initMedical);
    configNotify("loading", "", "Modification des données en cours...");
    //console.log(jsData)
    requestPatient
      .put(
        apiMedical.put + "/" + user.organisationRef + "/" + oldValue.id,
        initMedical,
        header
      )
      .then((res) => {
        console.log("enregistrement ok");

        configNotify(
          "success",
          "Modification réussi",
          "Les informations ont bien été modifiées"
        );
        setModalNotifyMsg("Les informations ont bien été modifiées");
        closeRef.current.click();
        notifyRef.current.click();
        refresh();
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
  const fValidate = (cl) => {
    setFormValidate(cl);
  };

  const getDate = () => {
    const mois = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];

    function frenchTodayDate() {
      let today = new Date();
      let year = today.getFullYear();
      let dayNumber = today.getDate();
      let month = mois[today.getMonth()];
      let weekday = today.toLocaleDateString("fr-FR", { weekday: "long" });
      let hours = today.getHours();
      let minutes = today.getMinutes();
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      return { weekday, dayNumber, month, year, hours, minutes };
    }

    const capitalize = ([first, ...rest]) =>
      first.toUpperCase() + rest.join("").toLowerCase();
    const { weekday, dayNumber, month, year, hours, minutes } =
      frenchTodayDate();
    const aujourdhui = `${capitalize(
      weekday
    )} ${dayNumber} ${month} ${year} - ${hours}H:${minutes}`;

    return aujourdhui;
  };
  const formatDate = (date) => {
    const day = date.getDate() < 10 ? 0 + "" + date.getDate() : date.getDate();
    const month =
      date.getMonth() < 10
        ? 0 + "" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    console.log(date.getFullYear() + "-" + month + "-" + day);
    return date.getFullYear() + "-" + month + "-" + day;
  };
  return (
    <>
      <div className="modal fade" id={id}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim">{title}</h4>
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
                onSubmit={oldValue.id != "" ? handleEditSubmit : handleSubmit}
                noValidate
              >
                <div className="mb-3 mt-3">
                  <label htmlFor="lname" className="form-label">
                    Intitulé
                  </label>
                  {list.length !== 0 ? (
                    <select
                      type="select"
                      className="form-select"
                      value={entitled}
                      onChange={(e) => setEntitled(e.target.value)}
                      required
                    >
                      <option>Sélectionnez l'intitule du compte rendu</option>
                      {list.map((data) => {
                        return (
                          <option key={data.uuid} value={data.uuid}>
                            {data.label}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      id="lname"
                      placeholder="Entrer l'intitule du compte rendu"
                      value={entitled}
                      onChange={(e) => setEntitled(e.target.value)}
                      required
                    />
                  )}
                  <div className="invalid-feedback">
                    Veuillez entrer un intitulé
                  </div>
                </div>
                <div className="mb-3 mt-3">
                  <label htmlFor="lname" className="form-label">
                    Détails
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="lname"
                    placeholder="Ecrire..."
                    rows="6"
                    value={detail}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setDetail(e.target.value);
                      }
                    }}
                    required
                  ></textarea>
                  <div>{detail.length + "/" + 500}</div>
                  <div className="invalid-feedback">
                    Veuillez entrer un détails
                  </div>
                </div>

                <div className="modal-footer d-flex justify-content-start border-0">
                  <button
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    ref={closeRef}
                    onClick={(e) => {
                      e.preventDefault();
                      fValidate("needs-validation");
                    }}
                  >
                    Annuler
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
    </>
  );
};

export default ModalMedical;
