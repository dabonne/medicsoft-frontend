import React, { useContext, useEffect, useRef, useState } from "react";
import back from "../../../assets/imgs/back.png";
import sui from "../../../assets/imgs/sui.png";
import view from "../../../assets/imgs/view.png";
import edit from "../../../assets/imgs/edit.png";
import del from "../../../assets/imgs/delete.png";
import user from "../../../assets/imgs/user.png";
import print from "../../../assets/imgs/print.png";
import ModalMedicalAntecedent from "../../../components/ModalMedicalAntecedent";
import requestPatient from "../../../services/requestPatient";
import { apiHospitalisation, apiMedical } from "../../../services/api";
import { AppContext } from "../../../services/context";
import DeleteModal from "../../../components/DeleteModal";
import Loading from "../../../components/Loading";
import requestDoctor from "../../../services/requestDoctor";
import { matrice, onSearch } from "../../../services/service";
import requestHospitalisation from "../../../services/requestHospitalisation";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import Input from "../../../components/Input";
import FormNotify from "../../../components/FormNotify";

const initData = {};
const FIchierHospi = ({ setNameIdx = () => {}, type = {} }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [search, setSearch] = useState("");
  const [stopLoad, setStopLoad] = useState(false);
  const [list, setList] = useState([]);
  const [editValue, setEditValue] = useState();
  const [refresh, setRefresh] = useState(0);
  const notify = useRef();
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [dataView, setDataView] = useState({});
  const [notifyBg, setNotifyBg] = useState("");
  const [notifyTitle, setNotifyTitle] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [modalNotifyMsg, setModalNotifyMsg] = useState("");

  const [formValidate, setFormValidate] = useState("needs-validation");
  const header = {
    headers: {
      Authorization: `${user.token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  const [fail, setFail] = useState(false);
  const { id } = useParams();
  const closeRef = useRef();
  const notifyRef = useRef();

  setNameIdx(1);
  useEffect(() => {
    console.log(type);
    get();
  }, [refresh]);

  const formik = useFormik({
    initialValues: initData,
    onSubmit: (values) => {
      console.log(values);
      if (values.uuid) {
        update(values);
      } else {
        post(values);
      }
    },
  });

  const get = () => {
    requestHospitalisation
      .get(
        apiHospitalisation.hospitalRecords + "/" + id + "/hospitalisation-file",
        header
      )
      .then((res) => {
        console.log(res.data);
        console.log("Rien");
        setStopLoad(true);
        const data = matrice(res.data);
        setPagination(data.list);
        if (data.list.length !== 0) {
          setDatas(data.list[0]);
          setList(data.list[0]);
          setTotalPage(data.counter);
        } else {
          setTotalPage(data.counter + 1);
        }
      })
      .catch((error) => {
        console.log(error);
        setStopLoad(true);
        setFail(true);
      });
  };

  const post = (values) => {
    requestHospitalisation
      .post(
        apiHospitalisation.hospitalRecords + "/" + id + "/hospitalisation-file",
        values,
        header
      )
      .then((res) => {
        console.log("enregistrement ok");
        formik.resetForm()
        setRefresh(refresh + 1);
        configNotify(
          "success",
          "Ajout réussi",
          "Les informations ont bien été enrégistrées"
        );
        setModalNotifyMsg("Le fichier a été ajouté avec succès");
        closeRef.current.click();
        notifyRef.current.click();
        get();
      })
      .catch((error) => {
        console.log(error);
        setStopLoad(true);
        setFail(true);
      });
  };
  const update = (values) => {
    requestHospitalisation
      .put(
        apiHospitalisation.hospitalRecords +
          "/" +
          id +
          "/hospitalisation-file/" +
          values.uuid,
        values,
        header
      )
      .then((res) => {
        //console.log("enregistrement ok");
        formik.resetForm()
        setRefresh(refresh + 1);
        configNotify(
          "success",
          "Modification réussi",
          "Les informations ont été enrégistrées"
        );
        setModalNotifyMsg("Les informations ont été modifiées");
        closeRef.current.click();
        notifyRef.current.click();
        get();
      })
      .catch((error) => {
        console.log(error);
        setStopLoad(true);
        setFail(true);
      });
  };
  const makeSearch = (e) => {
    e.preventDefault();
    onSearch(e, setList, datas, [
      "antecedentLabel",
      "typeAntecedent",
      "cni",
      "detail",
    ]);
  };
  const onDelete = (deleteId) => {
    //e.preventDefault();
    console.log(id);
    requestHospitalisation
      .delete(
        apiHospitalisation.hospitalRecords +
          "/" +
          id +
          "/hospitalisation-file/" +
          deleteId
      )
      .then((res) => {
        console.log("suppression ok");
        get();
        setModalNotifyMsg("Suppression réussie !");
        notifyRef.current.click();
        //setDelete([]);
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const makePagination = (e, page) => {
    e.preventDefault();
    if (page === "suiv" && pageNumber < Number(totalPage) - 1) {
      setPageNumber(pageNumber + 1);
      setList(pagination[pageNumber + 1]);
      setDatas(pagination[pageNumber + 1]);
    }
    if (page === "prece" && pageNumber >= 1) {
      setPageNumber(pageNumber - 1);
      setList(pagination[pageNumber - 1]);
      setDatas(pagination[pageNumber - 1]);
    }
  };

  const configNotify = (bg, title, message) => {
    setNotifyBg(bg);
    setNotifyTitle(title);
    setNotifyMessage(message);
  };

  const setEditData = (e, data) => {
    e.preventDefault();
    formik.setFieldValue("description", data.description);
    formik.setFieldValue("uuid", data.numero);
  };

  const downloadFile = (e, data) => {
    e.preventDefault();
    window.open("https://laafivisionmedical.com/" + data.fileName);}

  return (
    <div className="container-fluid">
      <div className="row my-3">
        <div className="col-9">
          <div className="d-inline-block">
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                makeSearch(e);
              }}
            />
          </div>
          <div className="btn-group">
            <div
              className="d-inline-block my-1 mx-1"
              onClick={(e) => makePagination(e, "prece")}
            >
              <img src={back} alt="" />
            </div>
            <div
              className="d-inline-block my-1 mx-1"
              onClick={(e) => makePagination(e, "suiv")}
            >
              <img src={sui} alt="" />
            </div>
          </div>
          <div className="d-inline-block my-1 mx-1 text-meduim text-bold">
            {pageNumber + 1}/{totalPage}
          </div>
        </div>
        <div className="col-3 d-flex justify-content-end align-items-center">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target={"#create"}
          >
            Ajouter
          </button>
        </div>
      </div>

      <Loading data={datas} stopLoad={stopLoad} fail={fail}>
        <div className="table-responsive-lg">
          <table className="table table-striped align-middle">
            <thead>
              <tr className="align-middle">
                <th scope="col" className="border-raduis-left">
                  Fichier ID
                </th>
                <th scope="col">Nom</th>
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
                      <span className="text-bold">PRESC-0218374</span>
                    </td>
                    <td>
                      <span className="text-bold">{data.description}</span>
                    </td>
                    {/*<td>
                  {data.parent}
                  </td>*/}
                    <td className="text-center">
                      <div className="btn-group">
                        <div className="d-inline-block mx-1">
                          <img
                            title="Voir le rendez vous"
                            onClick={(e) => {
                              downloadFile(e,data)
                            }}
                            src={view}
                            alt=""
                          />
                        </div>
                        <div className="d-inline-block mx-1">
                          <img
                            title="Éditer les données"
                            data-bs-toggle="modal"
                            data-bs-target={"#create"}
                            onClick={(e) => {
                              setEditData(e, data);
                            }}
                            src={edit}
                            alt=""
                          />
                        </div>
                        <div className="d-inline-block mx-1">
                          <img
                            title="Supprimer les données"
                            data-bs-toggle="modal"
                            data-bs-target={"#deleteData" + data.numero}
                            onClick={(e) => {
                              e.preventDefault();
                              //setDelete(["" + data.employeeReference]);
                              setEditValue({
                                ...data,
                                id: data.numero,
                              });
                            }}
                            src={del}
                            alt=""
                          />
                        </div>
                        <DeleteModal
                          id={data.numero}
                          modal={"deleteData" + data.numero}
                          title={"Supprimer les données"}
                          data={editValue}
                          onDelete={onDelete}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Loading>

      <div className="modal fade" id="create">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4 className="modal-title text-meduim text-bold">
                {formik.values["uuid"] !== undefined
                  ? "Modification du fichier"
                  : "Ajouter un fichier"}
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
                //className={formValidate}
                onSubmit={formik.handleSubmit}
                noValidate
              >
                <>
                  <Input
                    type={"text"}
                    name={"description"}
                    label={"Nom du fichier"}
                    placeholder={"Entrer la description du fichier"}
                    formik={formik}
                  />
                  {formik.values["uuid"] === undefined && (
                    <Input
                      type={"file"}
                      name={"file"}
                      label={"Sélectionnez le fichier"}
                      placeholder={""}
                      formik={formik}
                    />
                  )}
                </>

                <div className="modal-footer d-flex justify-content-start border-0">
                  <button
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    ref={closeRef}
                    onClick={(e) => {
                      e.preventDefault();
                      //fValidate("needs-validation");
                    }}
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    //onClick={() => fValidate("was-validated")}
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="viewAtt">
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

            <div className="modal-body">
              <p className="p-0">
                <span className="fw-bold">Antecedant</span> <br />
                <span>{dataView.antecedentLabel}</span>
              </p>
              <p className="p-0">
                <span className="fw-bold">Détails</span> <br />
                <div
                  className=""
                  dangerouslySetInnerHTML={{ __html: dataView.detail }}
                />
              </p>
            </div>

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
        }}
      />
    </div>
  );
};

export default FIchierHospi;
