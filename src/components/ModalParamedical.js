import FormNotify from "./FormNotify";
import { useContext, useEffect, useRef, useState } from "react";
import requestPatient from "../services/requestPatient";
import { apiParamedical } from "../services/api";
import { AppContext } from "../services/context";
import { useFormik } from "formik";
import { validateData } from "./ModalParamedicalMutiple";

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
  ARTERIAL_PRESSURE2: "",
  ARTERIAL_PRESSURE2: "",
  CARDIAC_FREQUENCY: "",
  BLOOD_SUGAR: "",
  OXYGEN_SATURATION: "",
  HEIGHT: "",
  BLOOD_GROUP: "",
};

const ModalParamedical = ({
  id,
  type,
  labelInput,
  placeholderInput,
  oldValue = { id: "", content: "", pressDia: "" },
  refresh = () => {},
}) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [paramedical, setParamedical] = useState("");
  const [pressionDia, setPressionDia] = useState("");
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [formValidate, setFormValidate] = useState("needs-validation");
  const [modalNotifyMsg, setModalNotifyMsg] = useState("");
  const closeRef = useRef();
  const notifyRef1 = useRef();
  const header = {
    headers: { Authorization: `${user.token}` },
  };

  useEffect(() => {
    console.log(type);
    if (oldValue.pressDia === null) {
      oldValue.pressDia = "";
    }
    if (type === "ARTERIAL_PRESSURE") {
      console.log("ok");
      formik.setFieldValue("ARTERIAL_PRESSURE1", oldValue.content);
      formik.setFieldValue("ARTERIAL_PRESSURE2", oldValue.pressDia);
    } else {
      formik.setFieldValue(type, oldValue.content);
      formik.setFieldValue("ARTERIAL_PRESSURE2", "");
    }
  }, [oldValue.content, oldValue.pressDia]);

  const handleSubmit = (value) => {
    initParamedical.patientCni = user.cni;
    initParamedical.paramedicalType = type;
    initParamedical.dateElaborate = formatDate(new Date());
    initParamedical.value =
      type === "ARTERIAL_PRESSURE" ? value["ARTERIAL_PRESSURE1"] : value[type];
    initParamedical.arterialPressure = value["ARTERIAL_PRESSURE2"];
    configNotify("loading", "", "Ajout des données en cours...");
    requestPatient
      .post(
        apiParamedical.post + "/" + user.organisationRef,
        initParamedical,
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
        notifyRef1.current.click();
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

  const handleEditSubmit = (value) => {
    initParamedical.patientCni = user.cni;
    initParamedical.paramedicalType = type;
    initParamedical.dateElaborate = formatDate(new Date());
    initParamedical.value =
      type === "ARTERIAL_PRESSURE" ? value["ARTERIAL_PRESSURE1"] : value[type];
    initParamedical.arterialPressure = value["ARTERIAL_PRESSURE2"];
    configNotify("loading", "", "Modification des données en cours...");
    //console.log(jsData)
    requestPatient
      .put(
        apiParamedical.put +
          "/" +
          oldValue.id +
          "/" +
          user.cni +
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
        notifyRef1.current.click();
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
  const formik = useFormik({
    initialValues: initData,
    validationSchema: validateData,
    onSubmit: (values) => {
      console.log(values);
      if (oldValue.id === "") {
        handleSubmit(values);
      } else {
        handleEditSubmit(values);
      }
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
              {notifyBg != "" ? (
                <FormNotify
                  bg={notifyBg}
                  title={notifyTitle}
                  message={notifyMessage}
                />
              ) : null}
              <form
                className={"mt-3"}
                onSubmit={formik.handleSubmit}
                noValidate
              >
                <div className="mb-3 mt-3">
                  <label htmlFor="transmission" className="form-label">
                    {labelInput}
                  </label>
                  {type === "TRANSMISSION" ? (
                    <>
                      <textarea
                        type="text"
                        className="form-control"
                        id="transmission"
                        name={type}
                        placeholder={placeholderInput}
                        value={formik.values[type]}
                        onBlur={formik.handleBlur}
                        onChange={(e) => {
                          if (e.target.value.length <= 500) {
                            formik.setFieldValue(type, e.target.value);
                          }
                        }}
                        rows="6"
                        required
                      ></textarea>
                      <div>{formik.values[type].length + "/" + 500}</div>
                      {formik.touched[type] && formik.errors[type] ? (
                        <div className="text-danger">{formik.errors[type]}</div>
                      ) : null}
                    </>
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      placeholder={placeholderInput}
                      name={
                        type === "ARTERIAL_PRESSURE"
                          ? "ARTERIAL_PRESSURE1"
                          : type
                      }
                      value={
                        type === "ARTERIAL_PRESSURE"
                          ? formik.values["ARTERIAL_PRESSURE1"]
                          : formik.values[type]
                      }
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                  )}
                  {type !== "ARTERIAL_PRESSURE" &&
                  formik.touched[type] &&
                  formik.errors[type] ? (
                    <div className="text-danger">{formik.errors[type]}</div>
                  ) : null}
                  {type === "ARTERIAL_PRESSURE" &&
                  formik.touched["ARTERIAL_PRESSURE1"] &&
                  formik.errors["ARTERIAL_PRESSURE1"] ? (
                    <div className="text-danger">
                      {formik.errors["ARTERIAL_PRESSURE1"]}
                    </div>
                  ) : null}
                </div>

                {labelInput === "Pression artérielle systolique" && (
                  <div className="mb-3 mt-3">
                    <label htmlFor="lname" className="form-label">
                      Pression artérielle diastolique
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={placeholderInput}
                      name="ARTERIAL_PRESSURE2"
                      value={formik.values["ARTERIAL_PRESSURE2"]}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                    {formik.touched["ARTERIAL_PRESSURE2"] &&
                    formik.errors["ARTERIAL_PRESSURE2"] ? (
                      <div className="text-danger">
                        {formik.errors["ARTERIAL_PRESSURE2"]}
                      </div>
                    ) : null}
                  </div>
                )}

                <div className="modal-footer d-flex justify-content-start border-0">
                  <button
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                    ref={closeRef}
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
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
        ref={notifyRef1}
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

export default ModalParamedical;
