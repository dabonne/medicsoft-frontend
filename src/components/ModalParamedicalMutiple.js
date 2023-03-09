import view from "../assets/imgs/view.png";
import add from "../assets/imgs/add.png";
import FormNotify from "./FormNotify";
import { useContext, useEffect, useRef, useState } from "react";
import requestPatient from "../services/requestPatient";
import { apiParamedical } from "../services/api";
import { AppContext } from "../services/context";
import InputField from "./InputField";

const initParamedical = {
  patientCni: "",
  value: "",
  paramedicalType: "",
  dateElaborate: "",
  arterialPressure: "",
};

const initData = {
  TRANSMISSION: "",
  WEIGHT: "",
  BODY_TEMPERATURE: "",
  ARTERIAL_PRESSURE1: "",
  ARTERIAL_PRESSURE2: "",
  CARDIAC_FREQUENCY: "",
  BLOOD_SUGAR: "",
  OXYGEN_SATURATION: "",
  HEIGHT: "",
  BLOOD_GROUP: "",
};

const ModalParamedicalMutiple = ({
  id,
  type,
  labelInput,
  placeholderInput,
  oldValue = { id: "", content: "", pressDia: "" },
  refresh = () => {},
}) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [paramedical, setParamedical] = useState(initData);
  const [pressionDia, setPressionDia] = useState("");
  const [list, setList] = useState([]);
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
    if (oldValue.content !== "") {
      initParamedical.value = oldValue.content;
      setParamedical(initParamedical.value);
      setPressionDia(oldValue.pressDia);
    }
  }, [oldValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    var first = 0;
    const date = formatDate(new Date());

    const data = Object.keys(paramedical).map((key) => {
      return key;
    });
    data.map((key) => {
      //console.log(paramedical)
      if (
        key == "ARTERIAL_PRESSURE1" ||
        (key == "ARTERIAL_PRESSURE2" && first === 0)
      ) {
        list.push({
          patientCni: user.cni,
          paramedicalType: "ARTERIAL_PRESSURE",
          dateElaborate: date,
          value: paramedical["ARTERIAL_PRESSURE1"],
          arterialPressure: paramedical["ARTERIAL_PRESSURE2"],
        });
        first = 1;
        
      }else{
        if(key !=="ARTERIAL_PRESSURE2"){
          list.push({
            patientCni: user.cni,
            paramedicalType: key,
            dateElaborate: date,
            value: paramedical[key],
            arterialPressure: "",
          });
        }
        
      } 
    });
    console.log(list);
    configNotify("loading", "", "Ajout des données en cours...");
    console.log(header)
    setModalNotifyMsg("Les informations ont bien été enrégistrées");
    requestPatient
      .post(
        apiParamedical.postMulti + "/" + user.organisationRef,
        list,
        header
      )
      .then((res) => {
        console.log("enregistrement ok");

        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );

        closeRef.current.click();
        notifyRef.current.click();
        refresh();
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

    console.log(initParamedical);
    configNotify("loading", "", "Modification des données en cours...");
    //console.log(jsData)
    requestPatient
      .put(
        apiParamedical.put +
          "/" +
          oldValue.id +
          "?value=" +
          initParamedical.value +
          "&date=" +
          initParamedical.dateElaborate +
          "&arterialPressure=" +
          initParamedical.arterialPressure,
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
          "Ouppss!!",
          "Une erreur est survenue, veuillez reesayer plus tard..."
        );
      });
  };
  const handleInputChange = (e) => {
    e.preventDefault();
    initParamedical.patientCni = user.cni;
    initParamedical.paramedicalType = type;
    initParamedical.dateElaborate = new Date();
    initParamedical.value = paramedical;
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

  const onChange = (name, value) => {
    console.log(name, value);
    setParamedical({
      ...paramedical,
      [name]: value,
    });

    console.log(paramedical);
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
              <form
                className={formValidate}
                onSubmit={oldValue.id != "" ? handleEditSubmit : handleSubmit}
                noValidate
              >
                <InputField
                  type={"text"}
                  label="Poid"
                  name={"WEIGHT"}
                  value={paramedical.WEIGHT}
                  onChange={onChange}
                />
                <InputField
                  type={"text"}
                  label="Température corporelle"
                  name={"BODY_TEMPERATURE"}
                  value={paramedical.BODY_TEMPERATURE}
                  onChange={onChange}
                />
                <InputField
                  type={"text"}
                  label="Pression artérielle systolique"
                  name={"ARTERIAL_PRESSURE1"}
                  value={paramedical.ARTERIAL_PRESSURE1}
                  onChange={onChange}
                />
                <InputField
                  type={"text"}
                  label="Pression artérielle diastolique"
                  name={"ARTERIAL_PRESSURE2"}
                  value={paramedical.ARTERIAL_PRESSURE2}
                  onChange={onChange}
                />
                <InputField
                  type={"text"}
                  label="Fréquence cardiaque"
                  name={"CARDIAC_FREQUENCY"}
                  value={paramedical.CARDIAC_FREQUENCY}
                  onChange={onChange}
                />
                <InputField
                  type={"text"}
                  label="Glycémie"
                  name={"BLOOD_SUGAR"}
                  value={paramedical.BLOOD_SUGAR}
                  onChange={onChange}
                />
                <InputField
                  type={"text"}
                  label="Saturation en oxygène"
                  name={"OXYGEN_SATURATION"}
                  value={paramedical.OXYGEN_SATURATION}
                  onChange={onChange}
                />
                <InputField
                  type={"text"}
                  label="Taille"
                  name={"HEIGHT"}
                  value={paramedical.HEIGHT}
                  onChange={onChange}
                />
                <InputField
                  type={"text"}
                  label="Groupe Sanguin"
                  name={"BLOOD_GROUP"}
                  value={paramedical.BLOOD_GROUP}
                  onChange={onChange}
                />
                <div className="mb-3 mt-3">
                  <label htmlFor="lname" className="form-label">
                    {labelInput}
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="lname"
                    placeholder={"Transmission"}
                    value={paramedical.TRANSMISSION}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setParamedical({
                          ...paramedical,
                          TRANSMISSION: e.target.value,
                        });
                      }
                    }}
                    rows="6"
                    required
                  ></textarea>
                  <div>{paramedical.TRANSMISSION.length + "/" + 500}</div>

                  <div className="invalid-feedback">Veuillez entrer un nom</div>
                </div>

                <input
                  type="text"
                  className="form-control"
                  id="lname"
                  placeholder={placeholderInput}
                  value={"paramedical"}
                  required
                />
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
                  //setModalNotifyMsg("");
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

export default ModalParamedicalMutiple;
