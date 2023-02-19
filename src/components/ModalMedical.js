import view from "../assets/imgs/view.png";
import add from "../assets/imgs/add.png";
import FormNotify from "./FormNotify";
import { useContext, useEffect, useRef, useState } from "react";
import requestPatient from "../services/requestPatient";
import { apiMedical, apiParamedical } from "../services/api";
import { AppContext } from "../services/context";

const initMedical = {
  "patientCni": "",
  "entitled": "",
  "medicalType": "",
  "dateElaborate": "",
  "detail": ""
};

const ModalMedical = ({ id,type, title, setRefresh = () => {}, oldValue={id:"", entitled:"", content:""}}) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [medical, setMedical] = useState(initMedical);
  const [entitled, setEntitled] = useState("")
  const [detail, setDetail] = useState("")
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
    if(oldValue.content !== ""  || oldValue.entitled !== ""){
      initMedical.entitled = oldValue.entitled;
      initMedical.detail = oldValue.content;
      setEntitled(initMedical.entitled)
      setDetail(initMedical.detail)
    }
  },[oldValue])

  const handleSubmit = (e) => {
    e.preventDefault();
    initMedical.patientCni = user.cni
    initMedical.medicalType = type
    initMedical.dateElaborate = formatDate(new Date())
    initMedical.entitled = entitled
    initMedical.detail = detail
    console.log(initMedical)
    configNotify("loading", "", "Ajout des données en cours...");
    //console.log(jsData)
    requestPatient
      .post(apiMedical.post+"/"+user.organisationRef, initMedical, header)
      .then((res) => {
        console.log("enregistrement ok");
        setRefresh(0)

        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );
        setModalNotifyMsg("L'employé a été ajouté avec succès");
        closeRef.current.click();
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

  const handleEditSubmit = (e) => {
    e.preventDefault();
    initMedical.patientCni = user.cni
    initMedical.medicalType = type
    initMedical.dateElaborate = formatDate(new Date())
    initMedical.entitled = entitled
    initMedical.detail = detail
    console.log(initMedical)
    configNotify("loading", "", "Modification des données en cours...");
    //console.log(jsData)
    requestPatient
      .put(apiMedical.put+"/"+oldValue.id+"?detail="+initMedical.detail+"&entiled="+initMedical.entitled, header)
      .then((res) => {
        console.log("enregistrement ok");

        configNotify(
          "success",
          "Modification réussi",
          "Les informations ont bien été modifiées"
        );
        setModalNotifyMsg("Les informations ont bien été modifiées avec succès");
        closeRef.current.click();
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
      hours = hours < 10 ? "0"+hours : hours
      minutes = minutes < 10 ? "0"+minutes : minutes
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
    const month = date.getMonth() < 10 ? 0 + "" + (date.getMonth() + 1) : (date.getMonth() + 1);
    console.log(date.getFullYear() + "-" + month + "-" + day)
    return date.getFullYear() + "-" + month + "-" + day;
  };
  return (
    <>
      <div className="modal fade" id={id}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim">
              {title}
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
              <form className={formValidate} onSubmit={oldValue.id != "" ? handleEditSubmit : handleSubmit} noValidate>
                <div className="mb-3 mt-3">
                  <label htmlFor="lname" className="form-label">
                    Intitulé
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lname"
                    placeholder="Entrer l'intitule du compte rendu"
                    value={entitled}
                    onChange={(e)=>setEntitled(e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">Veuillez entrer un nom</div>
                </div>
                <div className="mb-3 mt-3">
                  <label htmlFor="lname" className="form-label">
                    Détails
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lname"
                    placeholder="Ecrire..."
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">Veuillez entrer un nom</div>
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
    </>
  );
};

export default ModalMedical;
