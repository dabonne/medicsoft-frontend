import { useContext, useEffect, useRef, useState } from "react";

import del from "../../../assets/imgs/delete.png";
import edit from "../../../assets/imgs/edit.png";

import { useFormik } from "formik";
import InputField from "../../../components/InputField";
import requestDoctor from "../../../services/requestDoctor";
import { AppContext } from "../../../services/context";
import FormNotify from "../../../components/FormNotify";
import { useNavigate, useParams } from "react-router-dom";
import { apiBackOffice, apiDrug, apiPrescription } from "../../../services/api";
import { Typeahead } from "react-bootstrap-typeahead";
import requestBackOffice from "../../../services/requestBackOffice";
import ReactQuill from "react-quill";

const initData = {
  type: "",
  detail: "",
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

const PrescriptionForm = ({
  title = "",
  type = "",
  group = "",
  url = { get: "", post: "" },
}) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [data, setData] = useState([]);
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
  const [firstCall, setFirstCall] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState([]);
  const [LocalisationGroup, setLocalisationGroup] = useState([]);
  const [localisationSelected, setLocalisationSelected] = useState([]);
  const [familyGroup, setFamilyGroup] = useState([]);
  const [precision, setPrecision] = useState("");
  const [useProtocole, setUseProtocole] = useState(false);
  const [descriptif, setDescriptif] = useState([]);
  const [selectedDescriptif, setSelectedDescriptif] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    console.log(type);

    if (type.includes("d'examen")) {
      getfamilyBiological();
      //getFamilyProtocole();
    } else {
      getList();
    }
    //console.log(data);
    if (id !== undefined && firstCall !== 1) {
      getPrescriptionById(id);
      setFirstCall(firstCall + 1);
    }
    //console.log(list);
    ///backoffice-management/external-api/settings/{cliniqueId}/protocoles/family
  }, [list]);

  const getFamilyProtocole = () => {
    //console.log(url);
    requestBackOffice
      .get("settings/" + user.organisationRef + "/protocoles/family")
      .then((res) => {
        //setData(res.data);
        setFamilyGroup(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getListProtocole = (id) => {
    console.log(id);
    requestBackOffice
      .get(
        "settings/" + user.organisationRef + "/family/" + id + "/protocoles",
        header
      )
      .then((res) => {
        console.log(res.data);
        const tab = res.data.map((data) => {
          return {
            label: data.libelle,
            uuid: data.protocoleId,
          };
        });
        setData(tab);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getList = () => {
    console.log(url);
    requestDoctor
      .get(url.get)
      .then((res) => {
        setData(res.data);
        //console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getPrescriptionById = (id) => {
    requestDoctor
      .get(apiPrescription.getPrescriptionById + "/" + id, header)
      .then((res) => {
        console.log(res.data);
        //setDatas(res.data);
        setList({
          ...list,
          list: res.data.prescriptions,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getfamilyBiological = () => {
    requestBackOffice
      .get(apiBackOffice.familyBiological, header)
      .then((res) => {
        setFamilyGroup(res.data);
        //setData(res.data);
        //console.log(res.data)
        getList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getLocalisationImagery = (id) => {
    requestBackOffice
      .get(
        apiBackOffice.getLocalisationTypeImagery + "/" + id + "/localisation",
        header
      )
      .then((res) => {
        //console.log(res.data);
        setLocalisationGroup(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getImageryDescriptif = (id) => {
    requestBackOffice
      .get(
        apiDrug.settings + "/localisations/" + id + "/description-type-images",
        header
      )
      .then((res) => {
        setDescriptif(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getfamilyBiologicalById = (id) => {
    requestBackOffice
      .get(apiBackOffice.familyBiologicalById + "/" + id, header)
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const formik = useFormik({
    initialValues: initData,

    onSubmit: (values) => {
      console.log(values);
      //console.log(selectedOption);
      values.detail = precision;
      let presc = {
        type: "",
        detail: "",
      };
      let dataTab = [...list.list];
      if (type.includes("d'imagerie") && selectedOption.length !== 0) {
        console.log(selectedDescriptif);
        presc = {
          type: selectedOption[0].uuid, // values.type,
          detail: values.detail,
          descriptifId:
            selectedDescriptif.length !== 0
              ? selectedDescriptif[0].descriptifId
              : null,
          topographicRegion: {
            uuid: localisationSelected[0].uuid,
          },
        };
      }
      if (!type.includes("d'imagerie") && selectedOption.length !== 0) {
        presc = {
          type: selectedOption[0].uuid, // values.type,
          detail: values.detail,
        };
      }
      console.log(presc);

      if (presc.type !== "" && presc.type !== undefined) {
        dataTab = [...list.list, presc];
        console.log("dataTab");
        setList({
          ...list,
          list: [...list.list, presc],
        });
        setSelectedOption([]);
        setLocalisationSelected([]);
      }
      if (list.sendata && dataTab.length !== 0) {
        if (id !== undefined) {
          handleEditSubmit(dataTab);
        } else {
          console.log(presc);
          handleSubmit(dataTab);
        }
      }
      list.sendata = false;
      console.log(list);
      formik.resetForm();
    },
  });

  const editFromList = (e, uuid) => {
    e.preventDefault();
    console.log(uuid);
    var tab = list.list.filter((item) => {
      if (item.type !== uuid) {
        return item;
      }
      //console.log(data);
      //console.log(item);
      data.map((value) => {
        if (value.uuid === uuid) {
          if (type.includes("d'examen")) {
            const content =
              item.typeAnalysis.family !== null
                ? [item.typeAnalysis.family]
                : [];
            setSelectedFamily(content);
            familyChange(content);
            setSelectedOption([value]);
          } else if (type.includes("imagerie")) {
            const content = item.topographicRegion
              ? [item.topographicRegion]
              : [];
            setSelectedOption([value]);
            imageryLocalisationChange([value]);
            setLocalisationSelected(content);
          } else {
            setSelectedOption([value]);
          }
        }
      });

      formik.setFieldValue("type", item.type);
      //formik.setFieldValue("detail", item.detail);
      setPrecision(item.detail);
    });

    setList({
      ...list,
      list: tab,
    });
  };

  const deleteFromList = (e, uuid) => {
    e.preventDefault();
    console.log(uuid);
    var tab = list.list.filter((data) => data.type !== uuid);

    console.log(tab);
    setList({
      ...list,
      list: tab,
    });
  };

  const handleSubmit = (tab) => {
    configNotify("loading", "", "Ajout des données en cours...");

    requestDoctor
      .post(url.post + "/" + user.organisationRef + "/" + user.cni, tab, header)
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

  const handleEditSubmit = (tab) => {
    console.log(tab);
    configNotify("loading", "", "Modification des données en cours...");
    requestDoctor
      .put(url.update + "/" + user.organisationRef + "/" + id, tab, header)
      .then((res) => {
        console.log("enregistrement ok");

        configNotify(
          "success",
          "Modification réussi",
          "Les informations ont bien été modifiées"
        );
        setModalNotifyMsg("Les informations ont bien été modifiées");
        notifyRef.current.click();
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
  const handleInputChange = (input) => {
    // Filter the options based on the user input
    const filteredOptions = data.filter((option) =>
      option.label.toLowerCase().includes(input.toLowerCase())
    );
    return filteredOptions;
  };
  const familyChange = (e) => {
    console.log(e);
    setSelectedFamily(e);
    if (e.length !== 0) {
      /*if (useProtocole) {
        getListProtocole(e[0].uuid);
      } else {
        getfamilyBiologicalById(e[0].uuid);
      }*/
      getListProtocole(e[0].uuid);
    } else {
      setSelectedOption([]);
    }
  };

  const imageryLocalisationChange = (e) => {
    console.log(e);
    setSelectedOption(e);
    if (e.length !== 0) {
      getLocalisationImagery(e[0].uuid);
    } else {
      setLocalisationSelected([]);
    }
  };
  const renderMenuItemChildren = (option, props) => {
    return <div key={option.uuid}>{option.label}</div>;
  };

  const localisationChange = (e) => {
    console.log(e);
    setLocalisationSelected(e);
    if (e.length !== 0) {
      getImageryDescriptif(e[0].uuid);
    } else {
      setSelectedDescriptif([]);
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="col-12 mx-auto border border-1 border-radius p-4">
        <p className="text-16 text-bold">Prescription</p>
        {list.list.map((dta, idx) => {
          return (
            <div key={"medic" + idx} className="mb-3 d-flex">
              <div className="me-auto">
                <Doc />
                <span className="ms-2 fw-bold">
                  {data.map((d) => {
                    if (type.includes("imagerie")) {
                      return (
                        d.uuid === dta.type && (
                          <>
                            <span className="me-2"> {d.label}</span>
                            <span> ( {dta.topographicRegion.label} )</span>
                          </>
                        )
                      );
                    } else {
                      return d.uuid === dta.type && d.label;
                    }
                  })}
                </span>
              </div>
              <div className="me-2" onClick={(e) => editFromList(e, dta.type)}>
                <img src={edit} alt="" />
              </div>
              <div onClick={(e) => deleteFromList(e, dta.type)}>
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
          {/**
           * <div className="form-label mt-3">{group}</div>
          <InputField
            type={"select3"}
            name={"drug"}
            label="Médicaments ou DCI"
            placeholder="Veuillez choisir le nom du médicament"
            formik={formik}
            options={data.drugs}
          />
           */}

          {/*
           <InputField
            type={"select3"}
            name={"type"}
            label=""
            placeholder="Veuillez choisir le nom du médicament"
            formik={formik}
            options={data}
          />
           */}
          {type.includes("d'examen") ? (
            <>
              {/*** <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="flexCheckChecked"
                  onClick={(e) => {
                    if (!useProtocole) {
                      getFamilyProtocole();
                    } else {
                      getfamilyBiological();
                    }
                    setUseProtocole(!useProtocole);
                  }}
                  />
                  <label class="form-check-label" for="flexCheckChecked">
                    Sélectionnez parmi les protocoles
                  </label>
                  </div>
                  <div className="form-label mt-3">
                  {"Sélectionnez une famille d'analyse biologique"}
                  </div>
               */}
              <Typeahead
                id="basic-typeahead-goupe"
                labelKey="label"
                options={familyGroup}
                placeholder="Veuillez choisir une famille d'analyse biologique"
                onChange={familyChange}
                onInputChange={handleInputChange}
                renderMenuItemChildren={renderMenuItemChildren}
                selected={selectedFamily}
              />
              <div className="form-label mt-3">
                {"Sélectionnez une analyse biologique"}
              </div>
              <Typeahead
                id="basic-typeahead-family"
                labelKey="label"
                options={data}
                placeholder="Veuillez choisir une analyse biologique"
                onChange={setSelectedOption}
                onInputChange={handleInputChange}
                renderMenuItemChildren={renderMenuItemChildren}
                selected={selectedOption}
              />
            </>
          ) : (
            <>
              <div className="form-label mt-3">{type}</div>
              {type.includes("imagerie") ? (
                <>
                  <Typeahead
                    id="basic-typeahead-example"
                    labelKey="label"
                    options={data}
                    placeholder={"Veuillez choisir le type"}
                    onChange={imageryLocalisationChange}
                    onInputChange={handleInputChange}
                    renderMenuItemChildren={renderMenuItemChildren}
                    selected={selectedOption}
                  />
                  <div className="form-label mt-3">
                    {"Sélectionnez une localisation"}
                  </div>
                  <Typeahead
                    id="basic-typeahead-example"
                    labelKey="label"
                    options={LocalisationGroup}
                    placeholder={"Veuillez choisir le type"}
                    onChange={localisationChange}
                    onInputChange={handleInputChange}
                    renderMenuItemChildren={renderMenuItemChildren}
                    selected={localisationSelected}
                  />
                  <div className="form-label mt-3">
                    {"Sélectionnez un descriptif"}
                  </div>
                  <Typeahead
                    id="basic-typeahead-example"
                    labelKey="label"
                    options={descriptif}
                    placeholder={"Veuillez choisir le descriptif"}
                    onChange={setSelectedDescriptif}
                    onInputChange={handleInputChange}
                    renderMenuItemChildren={renderMenuItemChildren}
                    selected={selectedDescriptif}
                  />
                </>
              ) : (
                <>
                  <Typeahead
                    id="basic-typeahead-example"
                    labelKey="label"
                    options={data}
                    placeholder={"Veuillez choisir le type"}
                    onChange={setSelectedOption}
                    onInputChange={handleInputChange}
                    renderMenuItemChildren={renderMenuItemChildren}
                    selected={selectedOption}
                  />
                </>
              )}
            </>
          )}

          <div className="form-label mt-3">Précisions</div>
          {/**
             * <InputField
            type={"textarea"}
            name={"detail"}
            label=""
            placeholder="Ecrire ici"
            formik={formik}
          />
             */}
          <div className="mb-5">
            <ReactQuill
              theme="snow"
              value={precision}
              onChange={setPrecision}
              style={{ height: "200px" }}
            />
          </div>

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
                  navigate("/dashboard/patient/details/prescriptions");
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

export default PrescriptionForm;
