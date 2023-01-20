import React, { useContext, useEffect, useRef, useState } from "react";
import view from "../assets/imgs/view.png";
import edit from "../assets/imgs/edit.png";
import del from "../assets/imgs/delete.png";
import back from "../assets/imgs/back.png";
import sui from "../assets/imgs/sui.png";
import userProfile from "../assets/imgs/userinfo.png";
import requestEmploye from "../services/requestEmploye";
import { apiEmploye, apiUser } from "../services/api";
import FormNotify from "../components/FormNotify";
import Modal from "bootstrap/js/dist/modal";
import { AppContext, initialUser } from "../services/context";
import { getRoles } from "@testing-library/react";
import requestUser from "../services/requestUser";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { deleteUser } from "../services/storage";


const Employe = () => {
  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;
  const [refresh, setRefresh] = useState(0);
  const [search, setSearch] = useState("");
  const [dele, setDelete] = useState([]);
  const [datas, setDatas] = useState([]);
  const [list, setList] = useState([]);
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
  const [userInfos, setUserInfos] = useState({
    lastName: "",
    firstName: "",
    cnib: "",
    department: "",
    fonction: "",
    birthDate: "",
    employeeReference: "",
    username: "",
    roles: [],
  });
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [formValidate, setFormValidate] = useState("needs-validation");
  const [roles, setRoles] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [modalNotifyMsg, setModalNotifyMsg] = useState('')
  const header = {
    headers: { Authorization: `${user.token}` },
  };
  const closeRef = useRef();
  const closeEditRef = useRef();
  const notifyRef = useRef()

  useEffect(() => {
    requestEmploye
      .get(apiEmploye.getAll, header)
      .then((res) => {
        setDatas(res.data.employeeResponseList);
        setList(res.data.employeeResponseList);
        //console.log(res.data.employeeResponseList);
        getRoles();
      })
      .catch((error) => {
        deconnect()
      });
  }, [refresh]);

  const handleSubmit = (e) => {
    e.preventDefault();
    configNotify("loading", "", "Ajout d’un nouvel(le) employé(e) en cours...");
    //console.log(jsData)
    requestEmploye
      .post(apiEmploye.post, jsData, header)
      .then((res) => {
        console.log("enregistrement ok");
        setRefresh(refresh + 1);
        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );
        setModalNotifyMsg("L'employé a été ajoute avec succès")
        closeRef.current.click()
        notifyRef.current.click()
        
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

  const handleSubmitEdite = (e) => {
    e.preventDefault();
    configNotify("loading", "", "Modification de l'employé(e) en cours...");
    requestEmploye
      .put(apiEmploye.put, jsData)
      .then((res) => {
        console.log("enregistrement ok");
        setRefresh(refresh + 1);
        configNotify(
          "success",
          "Modification réussi",
          "Les informations ont bien été enrégistrées"
        );
        closeEditRef.current.click()
        setModalNotifyMsg("Les informations ont été très bien modifier")

        notifyRef.current.click()
        
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

  const getJsData = (e) => {
    e.preventDefault();
    requestEmploye
      .get(apiEmploye.getJsData)
      .then((res) => {
        //get dataForm success
        res.data.birthdate = "2000-01-01"
        setJsData(res.data);
        setLastName("");
        setFirstName("");
        setBirthdate("2000-01-01");
        setCnib("");
        setEmail("");
        setPhone("");
        setClassification("");
        setSpecialisation("");
        setFormValidate("needs-validation");
        configNotify("", "", "");
      })
      .catch((error) => {
        //get dataForm faille
        console.log(error);
      });
  };
  const getRoles = () => {
    requestUser
      .get(apiUser.getRoles,{
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        //get dataForm success
        //console.log(res.data);
        let list = res.data.map((data) => {
          return { value: data, label: data };
        });
        //console.log(list)
        setRoleList(list);
      })
      .catch((error) => {
        //get dataForm faille
        console.log(error);
      });
  };
  const activeUserRoles = () => {
    console.log({
      username: userInfos.username,
      email: userInfos.username,
      firstName: userInfos.firstName,
      lastName: userInfos.lastName,
      roles: roles.map((role) => role.value),
      employeeReference: userInfos.employeeReference,
    });
    requestEmploye
      .post(
        apiEmploye.active,
        {
          username: userInfos.username,
          email: userInfos.username,
          firstName: userInfos.firstName,
          lastName: userInfos.lastName,
          roles: roles.map((role) => role.value),
          employeeReference: userInfos.employeeReference,
        },
        header
      )
      .then((res) => {
        //get dataForm success
        console.log(res.data);
        setRefresh(refresh + 1);
        setModalNotifyMsg("Le ou les droits on été très bien attribuer")
        notifyRef.current.click()
        setRoles([])
      })
      .catch((error) => {
        //get dataForm faille
        setModalNotifyMsg("Échec de l'attribution du ou des droits")
        notifyRef.current.click()
        setRoles([])
        console.log(error);
      });
  };

  const disableAccount = () => {
    console.log({ 
      "employeeReference": userInfos.employeeReference,
      "organisationId": Object.keys(user.organisations)[0],
  })
    requestEmploye
      .put(apiEmploye.disableAccount, {data:{ 
        "employeeReference": userInfos.employeeReference,
        "organisationId": Object.keys(user.organisations)[0],
    }},header)
      .then((res) => {
        console.log("suppression ok");
        setModalNotifyMsg("Suppression réussie !")
        notifyRef.current.click()
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const deleteRole = (role) => {
    console.log({ 
      "employeeReference": userInfos.employeeReference,
      "role": role,
      "organisationId": Object.keys(user.organisations)[0],
  })
    requestEmploye
      .delete(apiEmploye.deleteRole, {data:{ 
        "employeeReference": userInfos.employeeReference,
        "role": role,
        "organisationId": Object.keys(user.organisations)[0],
    }},header)
      .then((res) => {
        console.log("suppression ok");
        setModalNotifyMsg("Suppression réussie !")
        notifyRef.current.click()
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const getEmploye = (e, ref) => {
    e.preventDefault();
    console.log("getEmploye");
    requestEmploye
      .get(`${apiEmploye.get}/${ref}`)
      .then((res) => {
        //setDatas(res.data.employeeResponseList);
        //console.log(res.data);
        setLastName(res.data.employeeResponseList[0].lastName);
        jsData.lastName = res.data.employeeResponseList[0].lastName;
        setFirstName(res.data.employeeResponseList[0].firstName);
        jsData.firstName = res.data.employeeResponseList[0].firstName;
        setBirthdate(res.data.employeeResponseList[0].birthDate);
        jsData.birthdate = res.data.employeeResponseList[0].birthDate;
        setCnib(res.data.employeeResponseList[0].cnib);
        jsData.cnib = res.data.employeeResponseList[0].cnib;
        setEmail(res.data.employeeResponseList[0].email);
        jsData.email = res.data.employeeResponseList[0].email;
        setPhone(res.data.employeeResponseList[0].phone);
        jsData.phone = res.data.employeeResponseList[0].phone;
        setClassification(res.data.employeeResponseList[0].classification);
        jsData.classification = res.data.employeeResponseList[0].classification;
        setSpecialisation(res.data.employeeResponseList[0].specialisation);
        jsData.specialisation = res.data.employeeResponseList[0].specialisation;
        jsData.specialisations =
          res.data.employeeResponseList[0].specialisations;
        jsData.classifications =
          res.data.employeeResponseList[0].classifications;
        jsData.employeeReference =
          res.data.employeeResponseList[0].employeeReference;
        jsData.registrationReference =
          res.data.employeeResponseList[0].employeeReference;
        setJsData(jsData);
        configNotify("", "", "");
        fValidate("needs-validation");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const viewEmploye = (data) => {
    userInfos.lastName = data.lastName;
    userInfos.firstName = data.firstName;
    userInfos.cnib = data.cnib;
    userInfos.department = data.department;
    userInfos.birthDate = data.birthDate;
    userInfos.fonction = "?";
    userInfos.username = data.email;
    userInfos.roles = data.roleList;
    userInfos.employeeReference = data.employeeReference;
    setRoles([]);
    console.log(userInfos);
  };
  const onDelete = (e) => {
    e.preventDefault();
    requestEmploye
      .delete(apiEmploye.delete, { data: dele })
      .then((res) => {
        console.log("suppression ok");
        setModalNotifyMsg("Suppression réussie !")
        notifyRef.current.click()
        setDelete([]);
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteList = (data) => {
    if (data.checkValue === undefined || data.checkValue === false) {
      data.checkValue = true;
      setDelete([...dele, data.employeeReference]);
    } else {
      data.checkValue = false;
      const list = dele.filter(function (ref) {
        return ref !== data.employeeReference;
      });
      setDelete(list);
    }
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

  const fValidate = (cl) => {
    setFormValidate(cl);
  };

  const configNotify = (bg, title, message) => {
    setNotifyBg(bg);
    setNotifyTitle(title);
    setNotifyMessage(message);
  };

  const deconnect = () => {
    deleteUser();
    onUserChange(initialUser);
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
        <h1 className="h2">Le personnel</h1>
        <div className="btn-toolbar">
          <button
            className="btn btn-primary"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#newEmploye"
            onClick={(e) => getJsData(e)}
          >
            +
          </button>
        </div>
      </div>
      <div className="modal fade" id="newEmploye">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Ajout d’un(e) employé(e)
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
                    placeholder="Entrer le ou les prénom(s) de l’employé(e)"
                    value={firstName}
                    onChange={(e) => {
                      e.preventDefault();
                      setFirstName(e.target.value);
                      jsData.firstName = e.target.value;
                      setJsData(jsData);
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
                    <option value="">Choisir la classification</option>
                    {Object.keys(jsData.classifications).map((key) => {
                      return (
                        <option key={key} value={jsData.classifications[key]}>
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
                    <option value="">Choisir la specialisation</option>
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
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    ref={closeRef}
                    onClick={(e) => {
                      e.preventDefault()
                      fValidate("needs-validation")
                    }}
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => fValidate("was-validated")}
                  >
                    Ajouter l’employé(e)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="editEmploye">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Modification d’un(e) employé(e)
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
                onSubmit={handleSubmitEdite}
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
                        <option key={key} value={jsData.classifications[key]}>
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
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    ref={closeEditRef}
                    onClick={() => fValidate("needs-validation")}
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal1"
                    onClick={() => fValidate("was-validated")}
                  >
                    Sauvegarder les informations
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="deleteEmploye">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Supprimer l'employé
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">Comfirmer l'action</div>

            <div className="modal-footer border-0 d-flex justify-content-start">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                onClick={(e) => {
                  onDelete(e);
                }}
              >
                Comfirmer
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="viewEmploye">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Information de l’employé
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col-3">
                  <img src={userProfile} alt="" />
                </div>
                <div className="col-9">
                  <div className="d-flex justify-content-between">
                    <span>Nom:</span>
                    <span className="text-bold">{userInfos.lastName}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Prenom:</span>
                    <span className="text-bold">{userInfos.firstName}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>CNIB:</span>
                    <span className="text-bold">{userInfos.cnib}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Département:</span>
                    <span className="text-bold">{userInfos.department}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>fonction:</span>
                    <span className="text-bold">{userInfos.fonction}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Date de naissance:</span>
                    <span className="text-bold">{userInfos.birthDate}</span>
                  </div>
                </div>
                {userInfos.roles[0] ? (
                  <div className="col-9 py-3">
                    <p className="fw-bold">Rôles et Droits</p>
                    {userInfos.roles.map((role, idx) => {
                      return (
                        <button className="btn btn-secondary me-1" key={idx}>
                          {role +" "} <span onClick={(e) =>{
                            e.preventDefault()
                            deleteRole(role)
                          }}>X</span>
                        </button>
                      );
                    })}
                    <div className="my-4">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={(e) =>{
                          e.preventDefault()
                          disableAccount()
                        }}
                      >
                        Bloquer le compte
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="modal-footer border-0 d-flex justify-content-start">
                    <button
                      type="button"
                      className="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteEmploye"
                    >
                      Supprimer
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={(e) => {
                        e.preventDefault();
                        var myModal = new Modal(
                          document.getElementById("activeEmploye"),
                          {}
                        );
                        myModal.show();
                      }}
                    >
                      Activer comme utilisateur
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="activeEmploye">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Attribution d’un droit
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <Select
                isMulti
                options={roleList}
                onChange={(choice) => setRoles(choice)}
              />
            </div>

            <div className="modal-footer border-0 d-flex justify-content-start">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => activeUserRoles()}
              >
                Attribuer le droit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="notifyRef">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                
              </h4>
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
                onClick={(e) =>{
                  e.preventDefault()
                  setModalNotifyMsg('')
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-4">
        <div className="col-12">
          <div className="d-inline-block">
            <input
              type="text"
              className="form-control search"
              placeholder="Rechercher par le nom, le prénom ou le département..."
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
      <p className="text-ultra-small">12 éléments affichés</p>
      <div className="table-responsive-sm">
        <table className="table table-striped align-middle">
          <thead>
            <tr className="align-middle">
              <th scope="col" className="border-raduis-left">
                #
              </th>
              <th scope="col">Nom et Prénom(s)</th>
              <th scope="col">Département</th>
              <th scope="col" className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((data, idx) => {
              //data.checkValue = false
              return (
                <tr key={idx}>
                  <td>
                    <input
                      type="checkbox"
                      value="seleted"
                      onChange={() => {
                        deleteList(data);
                      }}
                    />
                  </td>
                  <td>{data.firstName + " " + data.lastName}</td>
                  <td>{data.department}</td>
                  <td className="text-center">
                    <div className="btn-group">
                      <div className="d-inline-block mx-1">
                        <img
                          title="Voir l'employé"
                          data-bs-toggle="modal"
                          data-bs-target="#viewEmploye"
                          onClick={(e) => {
                            e.preventDefault();
                            setDelete(["" + data.employeeReference]);
                            viewEmploye(data);
                          }}
                          src={view}
                          alt=""
                        />
                      </div>
                      <div className="d-inline-block mx-1">
                        <img
                          title="Éditer l'employé"
                          data-bs-toggle="modal"
                          data-bs-target="#editEmploye"
                          onClick={(e) => {
                            getEmploye(e, data.employeeReference);
                          }}
                          src={edit}
                          alt=""
                        />
                      </div>
                      <div className="d-inline-block mx-1">
                        <img
                          title="Supprimer l'employé"
                          data-bs-toggle="modal"
                          data-bs-target="#deleteEmploye"
                          onClick={(e) => {
                            e.preventDefault();
                            setDelete(["" + data.employeeReference]);
                          }}
                          src={del}
                          alt=""
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="d-inline-block my-1 me-1">
        <img
          title="Supprimer les employés selectionnés"
          data-bs-toggle="modal"
          data-bs-target="#deleteEmploye"
          src={del}
          alt=""
        />
      </div>
      <input type="hidden" ref={notifyRef} data-bs-toggle="modal" data-bs-target="#notifyRef" onClick={(e) =>{
                    e.preventDefault()
                    setNotifyBg("")
                  }} />
    </>
  );
};

export default Employe;
