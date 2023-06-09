import React, { useContext, useEffect, useRef, useState } from "react";
import profile from "../assets/imgs/profile.png";
import upld from "../assets/imgs/upld.png";
import del from "../assets/imgs/delete.png";
import requestUser from "../services/requestUser";
import { apiUser } from "../services/api";
import { AppContext } from "../services/context";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;
  const [jsData, setJsData] = useState({
    registrationReference: "",
    firstName: "",
    lastName: "",
    cnib: "",
    title: "",
    birthdate: "",
    specialisation: "",
    specialisations: {},
    classification: "",
    classifications: {},
    email: "",
    phone: "",
    medicalStaff: "",
  });
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [cnib, setCnib] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [classification, setClassification] = useState("");
  const [specialisation, setSpecialisation] = useState("");
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [formValidate, setFormValidate] = useState("needs-validation");
  const [password, setPassword] = useState({
    new: "",
    newRepeat: "",
    old: "",
  });
  const header = {
    headers: { Authorization: `Bearer ${user.token}` },
  };
  const [refresh, setRefresh] = useState(0);
  const [userProfile, setUserProfile] = useState({});
  const [imgProfile, setImgProfile] = useState(user.profile);

  const [modalNotifyMsg, setModalNotifyMsg] = useState("");
  let notifyRef = useRef();
  let btnUpload = useRef();
  let navigate = useNavigate();

  useEffect(() => {
    requestUser
      .get(apiUser.get + "/" + user.organisationRef, header)
      .then((res) => {
        console.log(res.data.photo);
        setImgProfile("data:image/jpeg;base64," + res.data.photo);
        //console.log(res.data.employeeResponseList);
        setLastName(res.data.lastName);
        jsData.lastName = res.data.lastName;
        setFirstName(res.data.firstName);
        jsData.firstName = res.data.firstName;
        setBirthdate(res.data.birthDate);
        jsData.birthdate = res.data.birthDate;
        setCnib(res.data.cnib);
        jsData.cnib = res.data.cnib;
        setEmail(res.data.email);
        jsData.email = res.data.email;
        setPhone(res.data.phone);
        jsData.phone = res.data.phone;
        setClassification(res.data.classification);
        jsData.classification = res.data.classification;
        setSpecialisation(res.data.specialisation);
        jsData.specialisation = res.data.specialisation;
        jsData.specialisations = res.data.specialisations;
        jsData.classifications = res.data.classifications;
        jsData.employeeReference = res.data.employeeReference;
        jsData.registrationReference = res.data.employeeReference;
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const updateProfile = () => {
    requestUser
      .get(apiUser.get + "/" + user.organisationRef, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        console.log(res.data.photo);
        user.profile = "data:image/jpeg;base64," + res.data.photo;
        onUserChange(user);
        //console.log(res.data.employeeResponseList);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    configNotify("loading", "", "Ajout d’un nouvel(le) employé(e) en cours...");
    console.log({
      registrationReference: jsData.registrationReference,
      firstName: jsData.firstName,
      lastName: jsData.lastName,
      cnib: jsData.cnib,
      birthdate: jsData.birthdate,
      specialisation: jsData.specialisation,
      classification: jsData.classification,
      email: jsData.email,
      phone: jsData.phone,
      organisationId: user.organisationRef,
      title: "",
    });
    requestUser
      .put(
        apiUser.put,
        {
          registrationReference: jsData.registrationReference,
          firstName: jsData.firstName,
          lastName: jsData.lastName,
          cnib: jsData.cnib,
          birthdate: jsData.birthdate,
          specialisation: jsData.specialisation,
          classification: jsData.classification,
          email: jsData.email,
          phone: jsData.phone,
          organisationId: jsData.organisationId,
          title: "",
        },
        header
      )
      .then((res) => {
        console.log("enregistrement ok");
        setRefresh(refresh + 1);
        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );
        setModalNotifyMsg("Les informations ont modifier");
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

  const editProfilePicture = (e) => {
    e.preventDefault();
    console.log(userProfile);

    let data = new FormData(); //formdata object
    data.append("photo", userProfile); //append the values with key, value pair
    console.log({ photo: userProfile });

    requestUser
      .post(apiUser.profile, data, header)
      .then((res) => {
        //console.log("enregistrement ok");
        //setRefresh(refresh + 1);
        updateProfile();
        setModalNotifyMsg("La photo a été modifier");
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
  const fValidate = (cl) => {
    setFormValidate(cl);
  };
  const configNotify = (bg, title, message) => {
    setNotifyBg(bg);
    setNotifyTitle(title);
    setNotifyMessage(message);
  };

  const changePassword = (e) => {
    e.preventDefault();
    requestUser
      .post(
        apiUser.changePassword +
          "?password=" +
          password.new +
          "&oldPassword=" +
          password.old
      )
      .then((res) => {
        console.log(res.data);
        console.log("modification ok");
        setModalNotifyMsg("Les informations ont modifier");
        notifyRef.current.click();
      })
      .catch((error) => {
        console.log(error);
        setModalNotifyMsg("Echec de la modification");
        notifyRef.current.click();
      });
  };

  const onChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <>
      <div className="row">
        <h1 className="h2">Paramètres de mon compte</h1>
      </div>
      <div className="row my-4">
        <div className="col-10 col-sm-8 mx-auto col-md-5 col-lg-4">
          <div className="w-100 position-relative">
            <img width="100%" src={imgProfile} alt="" />
            <img
              className="position-absolute"
              src={upld}
              alt=""
              style={{ bottom: "20px", right: "20px" }}
              onClick={(e) => {
                e.preventDefault();
                btnUpload.current.click();
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                //console.log(e.target.files[0])
                setImgProfile(URL.createObjectURL(e.target.files[0]));
                setUserProfile(e.target.files[0]);
              }}
              ref={btnUpload}
              hidden
            />
          </div>
          <div className="my-3">
            <button
              className="btn btn-primary me-2"
              data-bs-dismiss="modal"
              style={{ width: "85%" }}
              onClick={editProfilePicture}
            >
              Modifier la photo
            </button>
            <img src={del} alt="" />
          </div>
          <div className="border border-1 border-radius p-4 my-4">
            <p className="text-16 text-bold ps-1">Autres actions</p>
            <button
              className="btn border border-1 border-radius my-2 w-100 text-bold text-start"
              data-bs-toggle="modal"
              data-bs-target="#editPassword"
            >
              Modifier le mot de passe
            </button>
            <button
              className="btn border border-1 border-radius my-2 w-100 text-bold text-start"
              data-bs-dismiss="modal"
            >
              Aide et support
            </button>
            <button
              className="btn border border-1 border-radius my-2 w-100 text-bold text-start"
              data-bs-dismiss="modal"
            >
              Conditions d’utilisation
            </button>
          </div>
        </div>
        <div className="col-12 col-md-7 col-lg-6 mx-auto border border-1 border-radius p-4">
          <p className="text-16 text-bold">Mes informations personnelles</p>
          <form className={formValidate} onSubmit={handleSubmit} noValidate>
            <div className="mb-3 mt-3">
              <label htmlFor="lname" className="form-label">
                Nom
              </label>
              <input
                type="text"
                className="form-control"
                id="lname"
                placeholder="Entrer le nom de famille de l’employé(e)"
                value={lastName}
                onChange={(e) => {
                  e.preventDefault();
                  setLastName(e.target.value);
                  jsData.lastName = e.target.value;
                  setJsData(jsData);
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
                placeholder="Entrer le ou les prenom(s) de l’employé(e)"
                value={firstName}
                onChange={(e) => {
                  e.preventDefault();
                  setFirstName(e.target.value);
                  jsData.firstName = e.target.value;
                  setJsData(jsData);
                }}
                required
              />
              <div className="invalid-feedback">Veuillez entrer un prénom</div>
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
                value={birthdate}
                onChange={(e) => {
                  e.preventDefault();
                  setBirthdate(e.target.value);
                  jsData.birthdate = e.target.value;
                  setJsData(jsData);
                }}
                required
              />
              <div className="invalid-feedback">
                Veuillez entrer une date de naissance
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
                value={cnib}
                onChange={(e) => {
                  e.preventDefault();
                  setCnib(e.target.value);
                  jsData.cnib = e.target.value;
                  setJsData(jsData);
                }}
                required
              />
              <div className="invalid-feedback">
                Veuillez entrer le numéro CNI
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Entrer l’adresse mail"
                value={email}
                onChange={(e) => {
                  e.preventDefault();
                  setEmail(e.target.value);
                  jsData.email = e.target.value;
                  setJsData(jsData);
                }}
                required
              />
              <div className="invalid-feedback">
                Veuillez entrer l’adresse mail
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Telephone
              </label>
              <input
                type="number"
                className="form-control"
                id="phone"
                placeholder="Entrer le numero de téléphone"
                value={phone}
                onChange={(e) => {
                  e.preventDefault();
                  setPhone(e.target.value);
                  jsData.phone = e.target.value;
                  setJsData(jsData);
                }}
                required
              />
              <div className="invalid-feedback">
                Veuillez entrer le numero de téléphone
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="clst" className="form-label">
                Classification
              </label>
              <select
                id="clst"
                className="form-select"
                value={classification}
                onChange={(e) => {
                  e.preventDefault();
                  setClassification(e.target.value);
                  jsData.classification = e.target.value;
                  setJsData(jsData);
                }}
                required
              >
                <option>Choisir la classification</option>
                {Object.keys(jsData.classifications).map((key) => {
                  return (
                    <option key={key} value={key}>
                      {jsData.classifications[key]}
                    </option>
                  );
                })}
              </select>
              <div className="invalid-feedback">
                Veuillez Choisir une classification
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="spft" className="form-label">
                Spécialisation
              </label>
              <select
                id="spft"
                className="form-select"
                value={specialisation}
                onChange={(e) => {
                  e.preventDefault();
                  setSpecialisation(e.target.value);
                  jsData.specialisation = e.target.value;
                  jsData.title = jsData.specialisations[e.target.value];
                  setJsData(jsData);
                }}
                required
              >
                <option>Choisir la specialisation</option>
                {Object.keys(jsData.specialisations).map((key) => {
                  return (
                    <option className="w-100" key={key} value={key}>
                      {jsData.specialisations[key]}
                    </option>
                  );
                })}
              </select>
              <div className="invalid-feedback">
                Veuillez Choisir une classification
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-start border-0">
              <button
                type="reset"
                className="btn btn-secondary me-2"
                data-bs-dismiss="modal"
                onClick={() => fValidate("needs-validation")}
              >
                Fermer
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => fValidate("was-validated")}
              >
                Sauvegarder les informations
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="modal fade" id="editPassword">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Modification du mot de passe
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div>
                <div className="mb-3 mt-3">
                  <label htmlFor="newMdp" className="form-label">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newMdp"
                    placeholder="Entrer le nouveau mot de passe"
                    name="new"
                    value={password.new}
                    onChange={onChange}
                  />
                  {password.newRepeat !== "" &&
                    password.newRepeat.length >= password.new.length &&
                    password.newRepeat !== password.new && (
                      <p className="fw-bold text-danger mt-2">
                        Les mots de passe que vous avez saisis ne correspondent
                        pas
                      </p>
                    )}
                </div>
                <div className="mb-3">
                  <label htmlFor="comfMdp" className="form-label">
                    Confirmation du nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="comfMdp"
                    placeholder="Confirmer le nouveau mot de passe"
                    name="newRepeat"
                    value={password.newRepeat}
                    onChange={onChange}
                  />
                  {password.newRepeat !== "" &&
                    password.newRepeat.length >= password.new.length &&
                    password.newRepeat !== password.new && (
                      <p className="fw-bold text-danger mt-2">
                        Les mots de passe que vous avez saisis ne correspondent
                        pas
                      </p>
                    )}
                </div>
                <div className="mb-3">
                  <label htmlFor="oldMdp" className="form-label">
                    Ancien mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="oldMdp"
                    placeholder="Entrer l’ancien mot de passe"
                    name="old"
                    value={password.old}
                    onChange={onChange}
                  />
                </div>
                <div className="modal-footer d-flex justify-content-start border-0">
                  <button
                    type="reset"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Fermer
                  </button>
                  <button
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={changePassword}
                    disabled={
                      password.newRepeat !== password.new ||
                      password.new === "" ||
                      password.newRepeat === ""
                        ? true
                        : false
                    }
                  >
                    Enrégistrer les modifications
                  </button>
                </div>
              </div>
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
                  //navigate("/dashboard/")
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
      <input
        type="button"
        hidden
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

export default Settings;
