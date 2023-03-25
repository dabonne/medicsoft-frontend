import { useContext, useEffect, useRef, useState } from "react";
import back from "../../../assets/imgs/back.png";
import sui from "../../../assets/imgs/sui.png";
import view from "../../../assets/imgs/view.png";
import edit from "../../../assets/imgs/edit.png";
import del from "../../../assets/imgs/delete.png";
import user from "../../../assets/imgs/user.png";
import print from "../../../assets/imgs/print.png";
import { useFormik } from "formik";
import InputField from "../../../components/InputField";
import requestDoctor from "../../../services/requestDoctor";
import { apiPrescription } from "../../../services/api";
import { AppContext } from "../../../services/context";
import FormNotify from "../../../components/FormNotify";
import { useNavigate } from "react-router-dom";

const initOrdonnance = {
  drug: "",
  dosage: "",
  during: "",
  dayOrWeekOrMonth: "",
  MORNING: "",
  NIGHT: "",
  EVENING: "",
  MIDDAY: "",
  frequency: "",
  quantity: "",
  administrationMode: "",
  precision: "",
};

const Doc = () => {
  return (
    <svg
      width="24"
      height="26"
      viewBox="0 0 24 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.2795 2.20136C15.1362 2.07243 14.9419 2 14.7393 2H4.36127C3.51751 2 2.8335 2.61561 2.8335 3.375V22.625C2.8335 23.3844 3.51751 24 4.36127 24H19.6391C20.4828 24 21.1668 23.3844 21.1668 22.625V7.78477M15.2795 2.20136L20.9431 7.29864C21.0863 7.42757 21.1668 7.60244 21.1668 7.78477M15.2795 2.20136V6.68477C15.2795 7.29228 15.7925 7.78477 16.4253 7.78477H21.1668"
        stroke="#005BDD"
        strokeWidth="4"
      />
    </svg>
  );
};

const PrescriptionFormOrdonance = (type = "") => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [data, setData] = useState({
    mode: {},
    dosage: {},
    period: {},
    drugs: [],
    dayWeekMonth: {},
  });
  const [periodeChecked, setPeriodeChecked] = useState({
    MORNING: false,
    NIGHT: false,
    EVENING: false,
    MIDDAY: false,
  });
  const [periodOrHour, setPeriodOrHour] = useState(false);
  const [list, setList] = useState({
    list: [],
    sendata: false,
  });
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [modalNotifyMsg, setModalNotifyMsg] = useState("");
  const navigate = useNavigate();
  const notifyRef = useRef();
  const header = {
    headers: { Authorization: `${user.token}` },
  };
  useEffect(() => {
    getList();
    console.log(data);
    console.log(list);
  }, [list]);

  const getList = () => {
    requestDoctor
      .get(apiPrescription.getListPresc)
      .then((res) => {
        setData(res.data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formik = useFormik({
    initialValues: initOrdonnance,

    onSubmit: (values) => {
      //console.log(values)
      const data = {
        drug: values.drug,
        dosage: values.dosage,
        during: values.during,
        dayOrWeekOrMonth: values.dayOrWeekOrMonth,
        periodEnumStringMap: {
          MORNING: values.MORNING,
          NIGHT: values.NIGHT,
          EVENING: values.EVENING,
          MIDDAY: values.MIDDAY,
        },
        hourPrescription: {
          frequency: values.frequency,
          quantity: values.quantity,
        },
        administrationMode: values.administrationMode,
        precision: values.precision,
      };
      setList({
        ...list,
        list: [...list.list, data],
      });
      //console.log(list);
      setPeriodeChecked({
        MORNING: false,
        NIGHT: false,
        EVENING: false,
        MIDDAY: false,
      });
      formik.resetForm();
      if (list.sendata) {
        handleSubmit(list.list);
      }
    },
  });

  const deleteFromList = (e, drug) => {
    e.preventDefault();

    var tab = list.list.filter((data) => data.drug !== drug);

    console.log(tab);
    setList({
      ...list,
      list: tab,
    });
  };

  const handleSubmit = () => {
    configNotify("loading", "", "Ajout des données en cours...");
    //console.log(jsData)
    requestDoctor
      .post(
        apiPrescription.postOrdonnance +
          "/" +
          user.organisationRef +
          "/" +
          user.cni,
        list.list,
        header
      )
      .then((res) => {
        console.log("enregistrement ok");

        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );
        setModalNotifyMsg("Les informations ont bien été enrégistrées");
        
        notifyRef.current.click();
        //refresh();
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
  return (
    <div className="row">
      <h2>Ordonnance médicale pharmaceutique</h2>
      <div className="col-12 mx-auto border border-1 border-radius p-4">
        <p className="text-16 text-bold">Prescription</p>
        {list.list.map((dta, idx) => {
          return (
            <div key={"medic" + idx} className="mb-3 d-flex">
              <div className="me-auto">
                <Doc />
                <span className="ms-2 fw-bold">
                  {data.drugs.map((d) => {
                    return d.uuid === dta.drug && d.label;
                  })}
                </span>
              </div>
              <div onClick={(e) => deleteFromList(e, dta.drug)}>
                <img src={del} alt="" />
              </div>
            </div>
          );
        })}
        <form className={""} onSubmit={formik.handleSubmit} noValidate>
          {notifyBg !== "" ? (
            <FormNotify
              bg={notifyBg}
              title={notifyTitle}
              message={notifyMessage}
            />
          ) : null}
          <div className="form-label mt-3">Médicaments ou DCI</div>
          <InputField
            type={"select3"}
            name={"drug"}
            label="Médicaments ou DCI"
            placeholder="Veuillez choisir le nom du médicament"
            formik={formik}
            options={data.drugs}
          />
          <div className="form-label mt-3">Dosage/Forme galénique</div>
          <InputField
            type={"select2"}
            name={"dosage"}
            label=""
            placeholder="Veuillez entrer le type du medicament (comprimé/gélule, ampoule,...)"
            formik={formik}
            options={data.dosage}
          />

          <div className="form-label mt-3">Durée</div>
          <InputField
            type={"text2"}
            name={"during"}
            label="Durée"
            placeholder="Veuillez entrer le durée"
            formik={formik}
          />
          <InputField
            type={"select2"}
            name={"dayOrWeekOrMonth"}
            label=""
            placeholder="Jours"
            formik={formik}
            options={data.dayWeekMonth}
          />
          <div className="form-label mt-3">Nombre de prise par jour</div>
          <div className="mt-3">
            <div
              className="btn btn-gray me-2"
              onClick={(e) => {
                e.preventDefault();
                setPeriodOrHour(false);
              }}
            >
              Par période
            </div>
            <div
              className="btn btn-gray me-2"
              onClick={(e) => {
                e.preventDefault();
                setPeriodOrHour(true);
              }}
            >
              Par heures
            </div>
            {periodOrHour ? (
              <div className="mt-3">
                <span>Toutes les </span>
                <InputField
                  inputClass="d-inline-block mx-2"
                  type={"text2"}
                  name="frequency"
                  formik={formik}
                  placeholder="ex: 6"
                />
                <span>heures</span>
                <InputField
                  inputClass="d-inline-block mx-2"
                  type={"text2"}
                  name="quantity"
                  formik={formik}
                  placeholder="Veuillez entrer la quantité à prendre"
                />
              </div>
            ) : (
              <div className="mt-3">
                {Object.keys(data.period).map((key) => {
                  return (
                    <div key={key}>
                      <div className="form-check d-inline-block">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          onChange={(e) => {
                            console.log(e.target.checked);
                            setPeriodeChecked({
                              ...periodeChecked,
                              [key]: e.target.checked,
                            });
                          }}
                          id="flexCheckChecked"
                          checked={periodeChecked[key]}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckChecked"
                        >
                          {data.period[key]}
                        </label>
                      </div>
                      {periodeChecked[key] && (
                        <InputField
                          inputClass="d-inline-block ms-2"
                          type={"text2"}
                          name={key}
                          formik={formik}
                          placeholder="Veuillez entrer la quantité à prendre"
                        />
                      )}
                      <br />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="form-label mt-3">Mode d’administration</div>
          <InputField
            type={"select2"}
            name={"administrationMode"}
            label=""
            placeholder="Veuillez choisir le mode d’administration"
            formik={formik}
            options={data.mode}
          />
          <div className="form-label mt-3">Précisions</div>
          <InputField
            type={"textarea"}
            name={"precision"}
            label=""
            placeholder="Ecrire ici"
            formik={formik}
            options={[]}
          />

          <div className="modal-footer d-flex justify-content-start border-0">
            <button type="submit" className="btn btn-secondary me-2">
              Valider et ajouter
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={(e) => {
                //e.preventDefault();
                list.sendata = true;
              }}
            >
              Valider
            </button>
          </div>
        </form>
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
                  navigate("/dashboard/patient/details/prescriptions")
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

export default PrescriptionFormOrdonance;
