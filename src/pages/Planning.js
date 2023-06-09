import React, { useContext, useEffect, useState } from "react";
import view from "../assets/imgs/view.png";
import edit from "../assets/imgs/edit.png";
import disable from "../assets/imgs/delete.png";
import back from "../assets/imgs/back.png";
import sui from "../assets/imgs/sui.png";
import userProfile from "../assets/imgs/userinfo.png";
import userp from "../assets/imgs/user.png";
import requestEmploye from "../services/requestEmploye";
import { apiEmploye } from "../services/api";
import FormNotify from "../components/FormNotify";
import { AppContext } from "../services/context";
import { getUser } from "../services/storage";
import { useNavigate } from "react-router-dom";
import { Calendar } from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const Planning = () => {
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
  });
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [formValidate, setFormValidate] = useState("needs-validation");
  const authCtx = useContext(AppContext);
  const { user, onUserChange } = authCtx;
  let navigate = useNavigate();
  const [value, onChange] = useState(new Date());

  useEffect(() => {
    setList([...Array(12).keys()]);
    onUserChange(getUser());
    isAuth();
    /*requestEmploye
      .get(apiEmploye.getAll)
      .then((res) => {
        setDatas(res.data.employeeResponseList);
        setList(res.data.employeeResponseList);
        document.documentElement.scrollTo(0, 0);
        //console.log(res.data.employeeResponseList);
      })
      .catch((error) => {});*/
  }, [refresh]);
  const isAuth = () => {
    if (user.isAuth === false || user.token === null || user.token === "") {
      console.log(`connexion échoué, isAuth`);
      console.log(user);

      return navigate("/");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    configNotify("loading", "", "Ajout d’un nouvel(le) employé(e) en cours...");
    //console.log(jsData)
    requestEmploye
      .post(apiEmploye.post, jsData)
      .then((res) => {
        console.log("enregistrement ok");
        setRefresh(refresh + 1);
        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );
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
        setJsData(res.data);
        setLastName("");
        setFirstName("");
        setBirthdate("");
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

  const getEmploye = (e, ref) => {
    e.preventDefault();
    console.log("getEmploye");
    requestEmploye
      .get(`${apiEmploye.get}/${ref}`)
      .then((res) => {
        //setDatas(res.data.employeeResponseList);
        console.log(res.data.employeeResponseList);
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
  };
  const onDelete = (e) => {
    e.preventDefault();
    requestEmploye
      .delete(apiEmploye.delete, { data: dele })
      .then((res) => {
        console.log("suppression ok");
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

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
        <h1 className="h2">Planning des Soignants</h1>
        <div className="btn-toolbar">
          <button
            className="btn btn-primary"
            type="button"
            //data-bs-toggle="modal"
            //data-bs-target="#newEmploye"
            //onClick={(e) => getJsData(e)}
          >
            +
          </button>
        </div>
      </div>
      <div className="modal fade" id="newEmploye">
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Planning des soignants
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
            <Calendar 
              onChange={onChange} 
              value={value} 
              onClickDay={(value, e) => {alert(value)}}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="editEmploye">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Modification d’une pharmacie
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
                  <label htmlFor="boite" className="form-label">
                    Boite postale
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="boite"
                    placeholder="Entrer la boîte postale"
                    value={classification}
                    onChange={(e) => {
                      e.preventDefault();
                      setClassification(e.target.value);
                      jsData.classification = e.target.value;
                      setJsData(jsData);
                    }}
                    required
                  />
                  <div className="invalid-feedback">
                    Veuillez entrer le numero de téléphone
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="adresse" className="form-label">
                    Adresse
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="adresse"
                    placeholder="Entrer l’adresse"
                    value={specialisation}
                    onChange={(e) => {
                      e.preventDefault();
                      setSpecialisation(e.target.value);
                      jsData.specialisation = e.target.value;
                      setJsData(jsData);
                    }}
                    required
                  />
                  <div className="invalid-feedback">
                    Veuillez entrer le numero de téléphone
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="fname" className="form-label">
                    Nom et prénom(s) du responsable
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fname"
                    placeholder="Entrer le nom et le(s) prénom(s) du responsable"
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
                    Veuillez entrer le nom et le prénom du responsable
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Email du responsable
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="date"
                    placeholder="Entrer l’adresse mail du responsable"
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
                    Veuillez entrer l'email du responsable
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="cni" className="form-label">
                    Téléphone du responsable
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="cni"
                    placeholder="Entrer numero de téléphone du responsable"
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
                    Veuillez entrer le numero de téléphone du responsable
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-start border-0">
                  <button
                    type="reset"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
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
                    Ajouter
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
                Supprimer la pharmacie
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
                Supprimer
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
              </div>
            </div>

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
              >
                Activer comme utilisateur
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
              placeholder="Rechercher par le nom, le prénom..."
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
      
      <div className="table-responsive-sm">
                <table className="table table-striped align-middle">
                  <thead>
                    <tr className="align-middle">
                      <th scope="col">Date</th>
                      <th scope="col" className="border-raduis-left">
                        Soignants
                      </th>
                      <th scope="col">Département</th>
                      <th scope="col" className="text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[].map((data, idx) => {
                      //data.checkValue = false
                      return (
                        <tr key={idx}>
                          <td>
                            <span className="text-bold">12/02/2023</span>
                          </td>
                          <td>
                            <div className="d-inline-block me-2 align-middle">
                              <img src={userp} alt="" />
                            </div>
                            <div className="d-inline-block align-middle">
                              <span className="text-bold">Dr. Jannette DOE</span>
                              <br />
                              <span>Psychiatre</span>
                            </div>
                          </td>
                          <td>
                            <button className="btn btn-gray border-radius text-bold">
                            Département 1
                            </button>
                          </td>
                          <td className="text-center">
                            <div className="btn-group">
                              <div className="d-inline-block mx-1">
                                <img
                                  title="Voir le planning"
                                  data-bs-toggle="modal"
                                  data-bs-target="#viewEmploye"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    //setDelete(["" + data.employeeReference]);
                                    //viewEmploye(data);
                                  }}
                                  src={edit}
                                  alt=""
                                />
                              </div>
                              <div className="d-inline-block mx-1">
                                <img
                                  title="Supprimer le planning"
                                  data-bs-toggle="modal"
                                  data-bs-target="#deleteEmploye"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    //setDelete(["" + data.employeeReference]);
                                  }}
                                  src={disable}
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
    </>
  );
};

export default Planning;
