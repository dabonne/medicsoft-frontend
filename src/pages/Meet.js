import React, { useContext, useEffect, useState } from "react";
import view from "../assets/imgs/view.png";
import edit from "../assets/imgs/edit.png";
import disable from "../assets/imgs/delete.png";
import back from "../assets/imgs/back.png";
import sui from "../assets/imgs/sui.png";
import userProfile from "../assets/imgs/userinfo.png";
import userp from "../assets/imgs/user.png";
import requestEmploye from "../services/requestEmploye";
import { apiAgenda, apiEmploye } from "../services/api";
import FormNotify from "../components/FormNotify";
import { AppContext } from "../services/context";
import { getUser } from "../services/storage";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import { useFormik } from "formik";
import requestAgenda from "../services/requestAgenda";

const initData = {
  startDate: "",
  endDate: "",
  doctorUuid: "",
  period: "",
  hour: "",
  patientCni: "",
  detail: ""
};
const Meet = () => {
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
  const header = {
    headers: { Authorization: `${user.token}` },
  };
  const [doctor, setDoctor] = useState({
    date: "",
    list: [],
  });
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

  const getEnvetEmploye = (values) => {
    //configNotify("loading", "", "Ajout d’un nouvel(le) employé(e) en cours...");
    //console.log(jsData)
    requestAgenda
      .get(
        apiAgenda.eventEmploye +
          "/" +
          user.organisationRef +
          "?startDate=" +
          values.startDate +
          "&endDate=" +
          values.endDate
      )
      .then((res) => {
        console.log(res.data);
        setDoctor({
          ...doctor,
          list: res.data,
        });
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

  const handleSubmit = () => {
    //configNotify("loading", "", "Ajout d’un nouvel(le) employé(e) en cours...");
    //console.log(jsData)
    requestAgenda
      .get(apiAgenda.eventEmploye)
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

  const formik = useFormik({
    initialValues: initData,
    onSubmit: (values) => {
      getEnvetEmploye(values);
      doctor.date = values.startDate + " - " + values.endDate;
    },
  });
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
        <h1 className="h2">Mes Rendez-vous</h1>
        <div className="btn-toolbar">
          <button
            className="btn btn-primary"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#newMeet"
            onClick={(e) => getJsData(e)}
          >
            +
          </button>
        </div>
      </div>
      <div className="modal fade" id="newMeet">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                Ajout un rendez vous
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
                onSubmit={formik.handleSubmit}
                noValidate
              >
                <label htmlFor="lname" className="form-label">
                  Date de début
                </label>
                <InputField type={"date"} name={"startDate"} formik={formik} />
                <label htmlFor="lname" className="form-label">
                  Date de fin
                </label>
                <InputField type={"date"} name={"endDate"} formik={formik} />
                <button type="submit" className="btn btn-primary mb-3">
                  Valider
                </button>
                <br />
                <label htmlFor="lname" className="form-label">
                  Les docteur disponible ({doctor.date})
                </label>
                <InputField
                  type={"select2"}
                  name={"doctorUuid"}
                  placeholder="Séletionnez un docteur"
                  formik={formik}
                  options={doctor.list}
                />
                <label htmlFor="lname" className="form-label">
                  Entrer la période
                </label>
                <InputField
                  type={"text2"}
                  name={"period"}
                  placeholder="Entrer la période"
                  formik={formik}
                />
                <label htmlFor="lname" className="form-label">
                  Entrer l'heure
                </label>
                <InputField
                  type={"text2"}
                  name={"hour"}
                  placeholder="Entrer l'heure"
                  formik={formik}
                />
                <label htmlFor="lname" className="form-label">
                  Entrer les détails
                </label>
                <InputField
                  type={"text2"}
                  name={"detail"}
                  placeholder="Entrer les détails"
                  formik={formik}
                />
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
              <th scope="col" className="border-raduis-left">
                Patients
              </th>
              <th scope="col">Date et heure</th>
              <th scope="col">Statut</th>
              <th scope="col" className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(9).keys()].map((data, idx) => {
              //data.checkValue = false
              return (
                <tr key={idx}>
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
                    <span className="text-bold">12/02/2023</span>
                    <br />
                    <span>
                      <span className="text-bold">Heure:</span> 10h30
                    </span>
                  </td>
                  <td>
                    <button className="btn bg-success border-radius text-bold">
                      Terminer
                    </button>
                  </td>
                  <td className="text-center">
                    <div className="btn-group">
                      <div className="d-inline-block mx-1">
                        <img
                          title="Voir l'employé"
                          data-bs-toggle="modal"
                          data-bs-target="#viewEmploye"
                          onClick={(e) => {
                            e.preventDefault();
                            //setDelete(["" + data.employeeReference]);
                            //viewEmploye(data);
                          }}
                          src={view}
                          alt=""
                        />
                      </div>
                      <div className="d-inline-block mx-1">
                        <img
                          title="Désactiver l'utilisateur"
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

export default Meet;
