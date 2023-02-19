import view from "../assets/imgs/view.png";
import add from "../assets/imgs/add.png";
import FormNotify from "./FormNotify";
import { useContext, useEffect, useRef, useState } from "react";
import requestPatient from "../services/requestPatient";
import { apiParamedical } from "../services/api";
import { AppContext } from "../services/context";

const initParamedical = {
  patientCni: "",
  value: "",
  paramedicalType: "",
  dateElaborate: "",
};

const ModalParamedical = ({ id,type, labelInput, placeholderInput, oldValue={id:"", content:""}}) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [paramedical, setParamedical] = useState("");
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
    console.log(oldValue.content)
    if(oldValue.content !== ""){
      initParamedical.value = oldValue.content;
      setParamedical(initParamedical.value)
    }
  },[oldValue])

  const handleSubmit = (e) => {
    e.preventDefault();
    initParamedical.patientCni = user.cni
    initParamedical.paramedicalType = type
    initParamedical.dateElaborate = formatDate(new Date())
    initParamedical.value = paramedical
    console.log(initParamedical)
    configNotify("loading", "", "Ajout des données en cours...");
    //console.log(jsData)
    requestPatient
      .post(apiParamedical.post+"/"+user.organisationRef, initParamedical, header)
      .then((res) => {
        console.log("enregistrement ok");

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
    initParamedical.patientCni = user.cni
    initParamedical.paramedicalType = type
    initParamedical.dateElaborate = formatDate(new Date())
    initParamedical.value = paramedical
   
    console.log(initParamedical)
    configNotify("loading", "", "Modification des données en cours...");
    //console.log(jsData)
    requestPatient
      .put(apiParamedical.put+"/"+oldValue.id+"?value="+initParamedical.value+"&date="+initParamedical.dateElaborate, header)
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
  const handleInputChange = (e) => {
    e.preventDefault()
    initParamedical.patientCni = user.cni
    initParamedical.paramedicalType = type
    initParamedical.dateElaborate = new Date()
    initParamedical.value = paramedical
    
  }

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
                Actuellement: <span className="text-bold">{getDate()}</span>
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
                    {labelInput}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lname"
                    placeholder={placeholderInput}
                    value={paramedical}
                    onChange={(e) => setParamedical(e.target.value)}
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

export default ModalParamedical;
