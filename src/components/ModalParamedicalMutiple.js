import FormNotify from "./FormNotify";
import { useContext, useRef, useState } from "react";
import requestPatient from "../services/requestPatient";
import { apiParamedical } from "../services/api";
import { AppContext } from "../services/context";
import InputField from "./InputField";
import { useFormik } from "formik";
import * as Yup from "yup";

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

export const validateData = Yup.object({
  TRANSMISSION: Yup.string()
    //.required("Le champ est obligatoire")
    .max(500, "Le texte ne doit pas dépasser 500 caractères"),
  //.required("Required"),
  WEIGHT: Yup.number()
    .typeError("Le poid doit être un nombre")
    //.required("Le poids est requis")
    .positive("Le poids doit être positif")
    .max(500, "Entrez un nombre compris entre 0 et 500"),
  BODY_TEMPERATURE: Yup.number()
    .typeError("La température doit être un nombre")
    .min(30, "Entrez un nombre compris entre 30 et 45")
    .max(45, "Entrez un nombre compris entre 30 et 45"),
  //.required("La température n'est pas valide"),
  ARTERIAL_PRESSURE1: Yup.number()
    .typeError("La pression systolique doit être un nombre")
    .min(20, "Entrez un nombre compris entre 20 et 350")
    .max(350, "Entrez un nombre compris entre 20 et 350"),
  //.required("La pression systolique est obligatoire"),
  ARTERIAL_PRESSURE2: Yup.number()
    .typeError("La pression diastolique doit être un nombre")
    .min(20, "Entrez un nombre compris entre 20 et 350")
    .max(350, "Entrez un nombre compris entre 20 et 350"),
  //.required("La pression diastolique est obligatoire"),
  CARDIAC_FREQUENCY: Yup.number()
    .typeError("La fréquence cardiaque doit être un nombre")
    .min(20, "Entrez un nombre compris entre 20 et 200")
    .max(200, "Entrez un nombre compris entre 20 et 200"),
  //.required("La fréquence cardiaque est obligatoire"),
  BLOOD_SUGAR: Yup.number()
    .typeError("La glycémie doit être un nombre")
    .min(0, "Entrez un nombre compris entre 0 et 30")
    .max(30, "Entrez un nombre compris entre 0 et 30"),
  //.required("La glycémie est obligatoire"),
  OXYGEN_SATURATION: Yup.number()
    .typeError("La saturation en oxygène doit être un nombre")
    .min(0, "Entrez un nombre compris entre 0 et 100")
    .max(100, "Entrez un nombre compris entre 0 et 100"),
  //.required("La saturation en oxygène est obligatoire"),
  HEIGHT: Yup.number()
    .typeError("La taille doit être un nombre ex: 1.45")
    .positive("La taille doit être un nombre positif")
    .max(100, "Entrez un nombre compris entre 0 et 5"),
  //.required("La taille est obligatoire"),
  BLOOD_GROUP: Yup.string()
    .oneOf(
      ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      "La groupe sanguin n'est pas valide"
    ),
    //.required("Le groupe sanguin est obligatoire"),
  //.required("Le poid est requis"),
});

const ModalParamedicalMutiple = ({
  id,
}) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [list, setList] = useState([]);
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const closeRef = useRef();
  const notifyRef = useRef();
  const header = {
    headers: { Authorization: `${user.token}` },
  };

  const handleSubmit = (values) => {
    var first = 0;
    const date = formatDate(new Date());

    const data = Object.keys(values).map((key) => {
      return key;
    });
    data.map((key) => {
      if (
        key === "ARTERIAL_PRESSURE1" ||
        (key === "ARTERIAL_PRESSURE2" && first === 0)
      ) {
        if(values["ARTERIAL_PRESSURE1"] !== "" && values["ARTERIAL_PRESSURE2"] !==""){
          list.push({
            patientCni: user.cni,
            paramedicalType: "ARTERIAL_PRESSURE",
            dateElaborate: date,
            value: values["ARTERIAL_PRESSURE1"],
            arterialPressure: values["ARTERIAL_PRESSURE2"],
          })
          first = 1
        }
        
      } else {
        if (key !== "ARTERIAL_PRESSURE2") {
          if(values[key] !==""){
            list.push({
              patientCni: user.cni,
              paramedicalType: key,
              dateElaborate: date,
              value: values[key],
              arterialPressure: "",
            });
          }
        }
      }
    });
    console.log(list);
    configNotify("loading", "", "Ajout des données en cours...");
    requestPatient
      .post(apiParamedical.postMulti + "/" + user.organisationRef + "/"+user.cni, list, header)
      .then((res) => {
        console.log("enregistrement ok");

        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );
        setList([])
        closeRef.current.click();
        notifyRef.current.click();
      })
      .catch((error) => {
        console.log(error);
        configNotify(
          "danger",
          "Oups !",
          "Une erreur est survenue. Veuillez réessayer ultérieurement..."
        );
        setList([])
      });
  };

  const configNotify = (bg, title, message) => {
    setNotifyBg(bg);
    setNotifyTitle(title);
    setNotifyMessage(message);
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
    return date.getFullYear() + "-" + month + "-" + day;
  };

  

  const formik = useFormik({
    initialValues: initData,
    validationSchema: validateData,
    onSubmit: (values) => {
      handleSubmit(values)
    },
  });
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
              {notifyBg !== "" ? (
                <FormNotify
                  bg={notifyBg}
                  title={notifyTitle}
                  message={notifyMessage}
                />
              ) : null}
              <form
                className="mt-3"
                onSubmit={formik.handleSubmit}
                noValidate
              >
                <InputField
                  type={"text"}
                  label="Entrer le poids en Kg"
                  name={"WEIGHT"}
                  formik={formik}
                />
                <InputField
                  type={"text"}
                  label="Entrer la température corporelle en degré Celsius"
                  name={"BODY_TEMPERATURE"}
                  formik={formik}
                />
                <InputField
                  type={"text"}
                  label="Entrer la pression systolique en mmHg"
                  name={"ARTERIAL_PRESSURE1"}
                  formik={formik}
                />
                <InputField
                  type={"text"}
                  label="Entrer la pression diastolique en mmHg"
                  name={"ARTERIAL_PRESSURE2"}
                  formik={formik}
                />
                <InputField
                  type={"text"}
                  label="Entrer la fréquence cardiaque en bpm"
                  name={"CARDIAC_FREQUENCY"}
                  formik={formik}
                />
                <InputField
                  type={"text"}
                  label="Entrer la glycémie en mg/dL"
                  name={"BLOOD_SUGAR"}
                  formik={formik}
                />
                <InputField
                  type={"text"}
                  label="Entrer la saturation en Sao2"
                  name={"OXYGEN_SATURATION"}
                  formik={formik}
                />
                <InputField
                  type={"text"}
                  label="Entrer la taille en m"
                  name={"HEIGHT"}
                  formik={formik}
                />
                <InputField
                  type={"select"}
                  placeholder="Entrer le groupe sanguin"
                  name={"BLOOD_GROUP"}
                  formik={formik}
                  options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                />
                <div className="mb-3 mt-3">
                  <label htmlFor="lname" className="form-label">
                    Note à transmettre à toute l’équipe
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    id="lname"
                    placeholder={"Transmission"}
                    name="TRANSMISSION"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows="6"
                    required
                  ></textarea>
                  <div>{formik.values["TRANSMISSION"].length + "/" + 500}</div>
                  {formik.touched["TRANSMISSION"] &&
                  formik.errors["TRANSMISSION"] ? (
                    <div className="text-danger">
                      {formik.errors["TRANSMISSION"]}
                    </div>
                  ) : null}
                </div>

                <div className="modal-footer d-flex justify-content-start border-0">
                  <button
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    ref={closeRef}
                    onClick ={(e) => e.preventDefault()}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="notifyRef1">
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

            <div className="modal-body">Les informations ont bien été enrégistrées</div>

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
        data-bs-target="#notifyRef1"
        onClick={(e) => {
          e.preventDefault();
          setNotifyBg("");
        }}
      />
    </>
  );
};

export default ModalParamedicalMutiple;
