import view from "../assets/imgs/view.png";
import add from "../assets/imgs/add.png";
import FormNotify from "./FormNotify";
import { useContext, useEffect, useRef, useState } from "react";
import requestPatient from "../services/requestPatient";
import { apiMedical, apiParamedical } from "../services/api";
import { AppContext } from "../services/context";
import requestDoctor from "../services/requestDoctor";
import ReactQuill from "react-quill";

const initMedical = {
  cni: "",
  disease: "",
  isDiseaseGenetic: true,
  startDate: "",
  endDate: "",
  parent: "",
};

const ModalMedicalAntecedent = ({
  id,
  type,
  title,
  refresh = () => {},
  oldValue = { id: "", cni: "", detail: "", typeAntecedent: "" },
}) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;

  const [disease, setDisease] = useState("");
  const [isDiseaseGenetic, setIsDiseaseGenetic] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [parent, setParent] = useState("");
  const [list, setList] = useState({});

  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [formValidate, setFormValidate] = useState("needs-validation");
  const [modalNotifyMsg, setModalNotifyMsg] = useState("");
  const [precision, setPrecision] = useState("");
  const closeRef = useRef();
  const closeEditRef = useRef();
  const notifyRef = useRef();
  const header = {
    headers: { Authorization: `${user.token}` },
  };

  const [antePerso, setAntePerso] = useState({
    cni: user.cni,
    detail: "",
    antecedent: "",
  });
  useEffect(() => {
    getForm();
    if (oldValue.id != "") {
      setAntePerso({
        cni: user.cni,
        antecedent: oldValue.typeAntecedent,
        detail: oldValue.detail,
      });
      console.log(oldValue);
    }
  }, [oldValue.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    configNotify("loading", "", "Ajout des données en cours...");
    //console.log(jsData)
    antePerso.detail = precision
    requestDoctor
      .post(
        apiMedical.postAntecedent + "/" + user.organisationRef,
        antePerso,
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
    const { id, ...ant } = antePerso;

    configNotify("loading", "", "Modification des données en cours...");
    //console.log(jsData)
    ant.detail = precision
    requestDoctor
      .put(apiMedical.putAntecedent + "/" + oldValue.id, ant, header)
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

  const getForm = () => {
    //console.log(jsData)
    requestDoctor
      .get(apiMedical.antecedentForm, header)
      .then((res) => {
        setList(res.data.antecedents);
        console.log(res.data);
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

  const formatDate = (date) => {
    const day = date.getDate() < 10 ? 0 + "" + date.getDate() : date.getDate();
    const month =
      date.getMonth() < 10
        ? 0 + "" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    console.log(date.getFullYear() + "-" + month + "-" + day);
    return date.getFullYear() + "-" + month + "-" + day;
  };

  const onChange = (e) => {
    console.log(e);
    setAntePerso({
      ...antePerso,
      [e.target.name]: e.target.value,
    });
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
                    Antecedent
                  </label>

                  <select
                    className="form-select"
                    name="antecedent"
                    value={antePerso.antecedent}
                    onChange={onChange}
                  >
                    <option>Sélectionnez un antecedent</option>
                    {Object.keys(list).map((key, idx) => {
                      return (
                        <option value={key} key={idx}>
                          {list[key]}
                        </option>
                      );
                    })}
                  </select>
                  <div className="invalid-feedback">
                    Veuillez entrer le nom de la maladie
                  </div>
                </div>

                <div className="mb-3 mt-3">
                  <label htmlFor="detail" className="form-label">
                    Detail
                  </label>
                  {
                    /**
                     * <textarea
                    type="text"
                    className="form-control"
                    id="detail"
                    name="detail"
                    placeholder="Entrer les details ok"
                    value={antePerso.detail}
                    onChange={onChange}
                    rows={6}
                    required
                  ></textarea>
                     */
                  }
                  <div className="mb-5">
                    <ReactQuill
                      theme="snow"
                      value={precision}
                      onChange={setPrecision}
                      style={{ height: "200px" }}
                    />
                  </div>
                  <div className="invalid-feedback">
                    Veuillez entrer une date valide
                  </div>
                </div>
                {/*<div className="mb-3 mt-3">
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
                </div>*/}

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

export default ModalMedicalAntecedent;
