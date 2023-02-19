import view from "../assets/imgs/view.png";
import add from "../assets/imgs/add.png";
import FormNotify from "./FormNotify";
import { useContext, useEffect, useRef, useState } from "react";
import requestPatient from "../services/requestPatient";
import { apiMedical, apiParamedical } from "../services/api";
import { AppContext } from "../services/context";

const initMedical = {
  cni: "",
  disease: "",
  isDiseaseGenetic: true,
  startDate: "",
  endDate: "",
  parent: ""
}

const ModalMedicalAntecedent = ({
  id,
  type,
  title,
  setRefresh = () => {},
  oldValue = { id: "", startDate: "", endDate: "", parent:"" },
}) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [medical, setMedical] = useState(initMedical);

  const [disease, setDisease] = useState("");
  const [isDiseaseGenetic, setIsDiseaseGenetic] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [parent, setParent] = useState("");
  const [list, setList] = useState({})

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
    getForm()
    if(oldValue.disease !=""){
      setDisease(oldValue.disease)
      setStartDate(oldValue.startDate)
      setEndDate(oldValue.endDate)
      Object.keys(list).map((key) => {
        if(list[key] === oldValue.parent){
          setParent(key)
        }
      })
    }
    
  }, [oldValue.disease]);

  const handleSubmit = (e) => {
    e.preventDefault();
    initMedical.cni = user.cni;
    initMedical.disease = disease;
    initMedical.isDiseaseGenetic = isDiseaseGenetic
    initMedical.startDate = startDate;
    initMedical.endDate = endDate;
    initMedical.parent = parent;
    console.log(initMedical);
    configNotify("loading", "", "Ajout des données en cours...");
    //console.log(jsData)
    requestPatient
      .post(apiMedical.postFamily + "/" + user.organisationRef, initMedical, header)
      .then((res) => {
        console.log("enregistrement ok");
        setRefresh(0);

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
    initMedical.cni = user.cni;
    initMedical.disease = disease;
    initMedical.isDiseaseGenetic = isDiseaseGenetic
    initMedical.startDate = startDate;
    initMedical.endDate = endDate;
    initMedical.parent = parent;
    console.log(initMedical);
    configNotify("loading", "", "Modification des données en cours...");
    //console.log(jsData)
    requestPatient
      .put(
        apiMedical.putFamily +"/" + oldValue.id, initMedical,header)
      .then((res) => {
        console.log("enregistrement ok");

        configNotify(
          "success",
          "Modification réussi",
          "Les informations ont bien été modifiées"
        );
        setModalNotifyMsg(
          "Les informations ont bien été modifiées avec succès"
        );
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

  const getForm = () => {
    
    //console.log(jsData)
    requestPatient
      .get(apiMedical.getPersonalForm, header)
      .then((res) => {
        setList(res.data.parents)
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
                    Nom de la maladie
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lname"
                    placeholder="Entrer le nom de la maladie"
                    value={disease}
                    onChange={(e) => setDisease(e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">Veuillez entrer un nom</div>
                </div>
                <div className="mb-3 mt-3 d-flex">
                  <div className="form-label me-auto">
                    Est-ce une maladie génétique ?
                  </div>
                  <div>
                    <div class="form-check d-inline-block mx-1">
                      <input
                        type="radio"
                        class="form-check-input"
                        id="radio1"
                        name="radio"
                        value="oui"
                        onChange={() =>{
                          setIsDiseaseGenetic(true)
                        }}
                        checked
                      />
                      
                      <label class="form-check-label" for="radio1">Oui</label>
                    </div>
                    <div class="form-check d-inline-block mx-1">
                      <input
                        type="radio"
                        class="form-check-input"
                        id="radio2"
                        name="radio"
                        value="non"
                        onChange={() =>{
                          setIsDiseaseGenetic(false)
                        }}
                      />
                      <label class="form-check-label" for="radio2">Non</label>
                    </div>
                  </div>
                  <div className="invalid-feedback">Veuillez entrer un nom</div>
                </div>

                <div className="mb-3 mt-3">
                  <label htmlFor="lname" className="form-label">
                    Date de début
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="lname"
                    placeholder="Entrer la date de début"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">Veuillez entrer un nom</div>
                </div>
                <div className="mb-3 mt-3">
                  <label htmlFor="lname" className="form-label">
                  Date de fin
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="lname"
                    placeholder="Entrer la date de fin"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                  <div className="invalid-feedback">Veuillez entrer un nom</div>
                </div>
                <div className="mb-3 mt-3">
                  <label htmlFor="lname" className="form-label">
                  Parent (facultatif)
                  </label>
                  <select
                    className="form-select"
                    value={parent}
                    onChange={(e) => setParent(e.target.value)}
                  >
                    <option>Choisir le lien de parenté</option>
                    {
                      Object.keys(list).map((key) =>{
                        return(
                          <option key={key} value={key}>{list[key]}</option>
                        )
                      })
                    }
                  </select>
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

export default ModalMedicalAntecedent;
