import React, { useContext, useEffect, useRef, useState } from "react";
import back from "../../assets/imgs/back.png";
import sui from "../../assets/imgs/sui.png";
import profile from "../../assets/imgs/profile.png";
import sang from "../../assets/imgs/sang.png";
import { Route, Routes, useNavigate } from "react-router-dom";
import FormNotify from "../../components/FormNotify";
import requestPatient from "../../services/requestPatient";
import { apiPatient } from "../../services/api";
import { AppContext } from "../../services/context";
import Loading from "../../components/Loading";

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

const ListPatient = () => {
  const authCtx = useContext(AppContext);
  const { user, onUserChange, onCniChange } = authCtx;
  const [refresh, setRefresh] = useState(0);
  const [stopLoad, setStopLoad] = useState(false);
  const [datas, setDatas] = useState([]);
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [formValidate, setFormValidate] = useState("needs-validation");
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [modalNotifyMsg, setModalNotifyMsg] = useState("");
  const [patient, setPatient] = useState(initPatient);
  let navigate = useNavigate();
  const closeRef = useRef();
  const closeEditRef = useRef();
  const notifyRef = useRef();

  const header = {
    headers: { Authorization: `${user.token}` },
  };
  useEffect(() => {
    //setDatas([...Array(20).keys()]);
    requestPatient
      .get(apiPatient.getAll + "/" + user.organisationRef, header)
      .then((res) => {
        setStopLoad(true)
        setDatas(res.data);
        console.table(res.data);
      })
      .catch((error) => {
        //deconnect()
      });
  }, [refresh]);

  const getJsData = (e) => {
    e.preventDefault();
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
      })
      .catch((error) => {
        //get dataForm faille
        console.log(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(patient);
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
        setRefresh(refresh + 1);
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

  const navigateToPatientInfo = (e, idx) => {
    e.preventDefault();
    user.cni = idx;
    onUserChange(user);
    return navigate(`details`);
  };

  const onSearch = (e) => {
    e.preventDefault();
    let str = e.target.value;
    let dd = datas.filter((data) => {
      const fullNameOne = data.lastName + " " + data.firstName;
      const fullNameTwo = data.firstName + " " + data.lastName;
      const fullNameOneDepart =
        data.lastName + " " + data.firstName + " " + data.department;
      const fullNameTwoDepart =
        data.firstName + " " + data.lastName + " " + data.department;

      return (
        data.lastName.toLowerCase().includes(str.toLowerCase()) ||
        data.firstName.toLowerCase().includes(str.toLowerCase()) ||
        data.department.toLowerCase().includes(str.toLowerCase()) ||
        fullNameOne.toLowerCase().includes(str.toLowerCase()) ||
        fullNameTwo.toLowerCase().includes(str.toLowerCase()) ||
        fullNameOneDepart.toLowerCase().includes(str.toLowerCase()) ||
        fullNameTwoDepart.toLowerCase().includes(str.toLowerCase())
      );
    });

    dd !== [] ? setList(dd) : setList(datas);
  };
  const configNotify = (bg, title, message) => {
    setNotifyBg(bg);
    setNotifyTitle(title);
    setNotifyMessage(message);
  };
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
        <h1 className="h2">Mes patients</h1>
        <div className="btn-toolbar">
          <button
            className="btn btn-primary"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#newPatient"
            onClick={(e) => getJsData(e)}
          >
            +
          </button>
        </div>
      </div>
      <div className="row my-4">
        <div className="col-12">
          <div className="d-inline-block">
            <input
              type="text"
              className="form-control search"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onSearch(e, search);
              }}
            />
          </div>
          <div className="btn-group">
            <div className="d-inline-block my-1 mx-1">
              <img src={back} alt="" />
            </div>
            <div className="d-inline-block my-1 mx-1">
              <img src={sui} alt="" />
            </div>
          </div>
          <div className="d-inline-block my-1 mx-1 text-meduim text-bold">
            1/10
          </div>
        </div>
      </div>

      <Loading data={datas} stopLoad={stopLoad}>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-3 mb-4">
          {datas.map((data, idx) => {
            return (
              <div
                key={idx}
                className="col"
                type="button"
                onClick={(e) => navigateToPatientInfo(e, data.cni)}
              >
                <div className="card v-card shadow-sm p-1">
                  <div className="d-inline-block mx-auto my-2">
                    <img className="circle" width="100%" src={profile} alt="" />
                  </div>
                  <div className="mt-2 mb-5">
                    <span className="d-block text-center text-bold text-meduim">
                      {data.lastname + " " + data.firstname}
                    </span>
                    <span className="d-block my-1 text-center">
                      <span>ID Patient: </span>
                      <span className="text-bold">{data.patientId}</span>
                    </span>
                    <span className="d-block my-1 text-center">
                      <span className="text-bold">
                        {data.age} ans . {data.gender}
                      </span>
                    </span>
                    <span className="d-block my-1 text-center">
                      <span className="text-bold text-meduim">
                        <img src={sang} alt="" /> {data.bloodGroup}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Loading>

      <div className="modal fade" id="newPatient">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Ajout d’un(e) patient(e)
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
              <form className={formValidate} onSubmit={handleSubmit} noValidate>
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
                    required
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
                    Ajouter le patient
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

export default ListPatient;
