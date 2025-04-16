import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../services/context";
import requestPatient from "../services/requestPatient";
import { apiPatient } from "../services/api";
import FormNotify from "./FormNotify";
import requestDoctor from "../services/requestDoctor";

const initPatient = {
  organisationId: "",
  firstname: "",
  lastname: "",
  birthdate: "",
  phoneNumber: "",
  parentFirstname: "",
  parentLastname: "",
  parentCnib: "",
  country: "",
  city: "",
  parentPhoneNumber: "",
  countryMinor: "",
  cityMinor: "",
  cni: "",
  gender: "",
  linkParental: "",
  cities: {},
  countries: {},
  genders: {},
  parental: {},
  mineur: false,
};

const ModalPatient = ({ refresh = () => {}, edit = false }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [stopLoad, setStopLoad] = useState(false);
  const [datas, setDatas] = useState([]);
  const [formValidate, setFormValidate] = useState("needs-validation");
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [modalNotifyMsg, setModalNotifyMsg] = useState("");
  const [patient, setPatient] = useState(initPatient);
  const closeRef = useRef();
  const closeEditRef = useRef();
  const notifyRef = useRef();

  const header = {
    headers: { Authorization: `${user.token}` },
  };
  //console.log(edit);
  useEffect(() => {
    //setDatas([...Array(20).keys()]);
    getJsData();
  }, [edit]);

  const getJsData = () => {
    //e.preventDefault();
    const orgId = user.organisationRef;
    requestPatient
      .get(apiPatient.getData)
      .then((res) => {
        //get dataForm success
        console.log(res.data);
        initPatient.organisationId = user.organisationRef;
        initPatient.countries = res.data.countries;
        initPatient.cities = res.data.cities;
        initPatient.genders = res.data.genders;
        initPatient.parental = res.data.parental;

        setPatient(initPatient);
        //console.log(patient);
        setFormValidate("needs-validation");
        configNotify("", "", "");
        if (edit) {
          getPatient();
        }
      })
      .catch((error) => {
        //get dataForm faille
        console.log(error);
      });
  };

  const getPatient = () => {
    requestPatient
      .get(apiPatient.get + "/" + user.cni, header)
      .then((res) => {
        //setDatas(res.data);
        console.log(res.data);
        const {
          countryId,
          cityId,
          countryMinorId,
          cityMinorId,
          genderId,
          minor,
          parent,
          ...resData
        } = res.data;
        setPatient({
          ...patient,
          ...res.data,
          organisationRef: user.organisationRef,
          ...resData,
          country: countryId,
          city: cityId,
          countryMinor: countryMinorId,
          cityMinor: cityMinorId,
          gender: genderId,
          parentFirstname: parent?.firstname,
          parentLastname: parent?.lastname,
          parentCnib: parent?.cni,
          parentPhoneNumber: parent?.phone,
          linkParental: parent?.linkParentalId,
          mineur:minor ? "mineur" : ""
        });
      })
      .catch((error) => {
        //deconnect()
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(patient);
    patient.cni = patient.cni?.length !=0 ? patient.cni : '0000000000';
    configNotify("loading", "", "Ajout des données en cours...");
    requestPatient
      .post(apiPatient.post, patient, header)
      .then((res) => {
        console.log("enregistrement ok");
        console.log(res.data);
        //setRefresh(refresh + 1);
        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );
        setModalNotifyMsg("Le patient a été ajouté avec succès");
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
    console.log(patient);
    configNotify("loading", "", "Modification des données en cours...");
    requestDoctor
      .put(apiPatient.putOrDelete, patient, header)
      .then((res) => {
        console.log("enregistrement ok");
        console.log(res.data);
        //setRefresh(refresh + 1);
        configNotify(
          "success",
          "Modification réussi",
          "Les informations ont bien été modifiées"
        );
        setModalNotifyMsg("Les informations ont bien été modifiées");
        closeRef.current.click();
        notifyRef.current.click();
        // refresh();
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

  const handleInputChange = (name, e) => {
    const value = name === "mineur" ? !patient.mineur : e.target.value;
    setPatient({
      ...patient,
      [name]: value,
    });
  };
  const fValidate = (cl) => {
    setFormValidate(cl);
  };

  const configNotify = (bg, title, message) => {
    setNotifyBg(bg);
    setNotifyTitle(title);
    setNotifyMessage(message);
  };
  return (
    <>
      <div className="modal fade" id="newPatient">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                {edit
                  ? "Modification des informations du patient"
                  : "Ajout d’un(e) patient(e)"}
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
                onSubmit={edit ? handleEditSubmit : handleSubmit}
                noValidate
              >
                <div className="mb-3 mt-3">
                  <label htmlFor="lname" className="form-label">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lname"
                    placeholder="Entrer le nom de famille du patient"
                    value={patient.lastname}
                    onChange={(e) => {
                      handleInputChange("lastname", e);
                    }}
                    required
                  />
                  <div className="invalid-feedback">Veuillez entrer un nom</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="fname" className="form-label">
                    Prénom(s)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fname"
                    placeholder="Entrer le ou les prénom(s) du patient"
                    value={patient.firstname}
                    onChange={(e) => {
                      handleInputChange("firstname", e);
                    }}
                    required
                  />
                  <div className="invalid-feedback">
                    Veuillez entrer un prénom
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    placeholder="Entrer la date de naissance"
                    value={patient.birthdate}
                    onChange={(e) => {
                      handleInputChange("birthdate", e);
                    }}
                    required
                  />
                  <div className="invalid-feedback">
                    Veuillez entrer une date de naissance
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">
                    Téléphone
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="phoneNumber"
                    placeholder="Entrer le numéro de téléphone du patient"
                    value={patient.phoneNumber}
                    onChange={(e) => {
                      handleInputChange("phoneNumber", e);
                    }}
                    required
                  />
                  <div className="invalid-feedback">
                    Veuillez entrer le numéro de téléphone
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="clst" className="form-label">
                    Pays
                  </label>
                  <select
                    id="clst"
                    className="form-select"
                    value={patient.country}
                    onChange={(e) => {
                      handleInputChange("country", e);
                    }}
                    required
                  >
                    <option value="">Choisir le pays</option>
                    {Object.keys(patient.countries).map((key) => {
                      return (
                        <option key={key} value={key}>
                          {patient.countries[key]}
                        </option>
                      );
                    })}
                  </select>
                  <div className="invalid-feedback">
                    Veuillez Choisir le pays
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="clst" className="form-label">
                    Ville
                  </label>
                  <select
                    id="clst"
                    className="form-select"
                    value={patient.city}
                    onChange={(e) => {
                      handleInputChange("city", e);
                    }}
                    required
                  >
                    <option value="">Choisir la ville</option>
                    {Object.keys(patient.cities).map((key) => {
                      return (
                        <option key={key} value={key}>
                          {patient.cities[key]}
                        </option>
                      );
                    })}
                  </select>
                  <div className="invalid-feedback">
                    Veuillez Choisir une classification
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="clst" className="form-label">
                    Genre
                  </label>
                  <select
                    id="clst"
                    className="form-select"
                    value={patient.gender}
                    onChange={(e) => {
                      handleInputChange("gender", e);
                    }}
                    required
                  >
                    <option value="">Choisir le genre</option>
                    {Object.keys(patient.genders).map((key) => {
                      return (
                        <option key={key} value={key}>
                          {patient.genders[key]}
                        </option>
                      );
                    })}
                  </select>
                  <div className="invalid-feedback">
                    Veuillez Choisir un genre
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="cni" className="form-label">
                    Numéro CNI
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="cni"
                    placeholder="Entrer le numéro CNI"
                    value={patient.cni}
                    onChange={(e) => {
                      handleInputChange("cni", e);
                    }}
                    //required
                  />
                  <div className="invalid-feedback">
                    Veuillez entrer le numéro CNI
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={patient.mineur}
                      onChange={(e) => {
                        e.target.value = !patient.value;
                        handleInputChange("mineur", e);
                      }}
                    />
                    <label className="form-check-label">Mineur</label>
                  </div>
                </div>
                {patient.mineur && (
                  <>
                    <hr />
                    <p>Informations du parent</p>
                    <div className="mb-3">
                      <label htmlFor="plname" className="form-label">
                        Nom du parent
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="plname"
                        placeholder="Entrer le numero de téléphone"
                        value={patient.parentLastname}
                        onChange={(e) => {
                          handleInputChange("parentLastname", e);
                        }}
                        required
                      />
                      <div className="invalid-feedback">
                        Veuillez entrer le nom du parent
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="pfname" className="form-label">
                        Prénom du parent
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="pfname"
                        placeholder="Entrer le numero de téléphone"
                        value={patient.parentFirstname}
                        onChange={(e) => {
                          handleInputChange("parentFirstname", e);
                        }}
                        required
                      />
                      <div className="invalid-feedback">
                        Veuillez entrer le prénom du parent
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="parentPhoneNumber" className="form-label">
                        téléphone du parent
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="parentPhoneNumber"
                        placeholder="Entrer le numero de téléphone du parent"
                        value={patient.parentPhoneNumber}
                        onChange={(e) => {
                          handleInputChange("parentPhoneNumber", e);
                        }}
                        required
                      />
                      <div className="invalid-feedback">
                        Veuillez entrer le numéro de téléphone du parent
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="pcni" className="form-label">
                        Numéro CNI du parent
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="pcni"
                        placeholder="Entrer le numéro cni du parent"
                        value={patient.parentCnib}
                        onChange={(e) => {
                          handleInputChange("parentCnib", e);
                        }}
                        required
                      />
                      <div className="invalid-feedback">
                        Veuillez entrer le numéro CNI du parent
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="clst" className="form-label">
                        Lien de parenté
                      </label>
                      <select
                        id="clst"
                        className="form-select"
                        value={patient.linkParental}
                        onChange={(e) => {
                          handleInputChange("linkParental", e);
                        }}
                        required
                      >
                        <option value="">Choisir le lien</option>
                        {Object.keys(patient.parental).map((key) => {
                          return (
                            <option key={key} value={key}>
                              {patient.parental[key]}
                            </option>
                          );
                        })}
                      </select>
                      <div className="invalid-feedback">
                        Veuillez Choisir le lien de parenté
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="clst" className="form-label">
                        Pays
                      </label>
                      <select
                        id="clst"
                        className="form-select"
                        value={patient.countryMinor}
                        onChange={(e) => {
                          handleInputChange("countryMinor", e);
                        }}
                        required
                      >
                        <option value="">Choisir le pays</option>
                        {Object.keys(patient.countries).map((key) => {
                          return (
                            <option key={key} value={key}>
                              {patient.countries[key]}
                            </option>
                          );
                        })}
                      </select>
                      <div className="invalid-feedback">
                        Veuillez Choisir le pays
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="clst" className="form-label">
                        Ville
                      </label>
                      <select
                        id="clst"
                        className="form-select"
                        value={patient.cityMinor}
                        onChange={(e) => {
                          handleInputChange("cityMinor", e);
                        }}
                        required
                      >
                        <option value="">Choisir la ville</option>
                        {Object.keys(patient.cities).map((key) => {
                          return (
                            <option key={key} value={key}>
                              {patient.cities[key]}
                            </option>
                          );
                        })}
                      </select>
                      <div className="invalid-feedback">
                        Veuillez Choisir une ville
                      </div>
                    </div>
                  </>
                )}
                <div className="modal-footer d-flex justify-content-start border-0">
                  <button
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    ref={closeRef}
                    onClick={(e) => {
                      e.preventDefault();
                      fValidate("needs-validation");
                    }}
                  >
                    Fermer
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

export default ModalPatient;
