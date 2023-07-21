import React, { useContext, useEffect, useRef, useState } from "react";
import back from "../../../assets/imgs/back.png";
import sui from "../../../assets/imgs/sui.png";
import view from "../../../assets/imgs/view.png";
import edit from "../../../assets/imgs/edit.png";
import del from "../../../assets/imgs/delete.png";
import user from "../../../assets/imgs/user.png";
import print from "../../../assets/imgs/print.png";
import ModalMedical from "../../../components/ModalMedical";
import requestPatient from "../../../services/requestPatient";
import { apiMedical } from "../../../services/api";
import { AppContext } from "../../../services/context";
import DeleteModal from "../../../components/DeleteModal";
import requestDoctor from "../../../services/requestDoctor";
import Loading from "../../../components/Loading";
import { matrice, onSearch } from "../../../services/service";

const initSelected = {
  idData: "",
  idModale: "",
  title: "",
  callBack: () => {},
};

const DonneeCompteRendu = ({ setNameIdx, type = {} }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [search, setSearch] = useState("");
  const [stopLoad, setStopLoad] = useState(false);
  const [list, setList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [editValue, setEditValue] = useState();
  const [refresh, setRefresh] = useState(0);
  const [seletedData, setSelectedData] = useState(initSelected);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [dataView, setDataView] = useState({});
  const header = {
    headers: { Authorization: `${user.token}` },
  };
  const [fail, setFail] = useState(false);

  const notify = useRef();
  useEffect(() => {
    console.log(type);
    //getListe();
    get();
  }, [refresh]);

  if (window.location.pathname.includes("imageries")) {
    setNameIdx(2);
  }
  if (window.location.pathname.includes("examens-specialises")) {
    setNameIdx(3);
  }
  if (window.location.pathname.includes("analyses-biologiques")) {
    setNameIdx(4);
  }
  if (window.location.pathname.includes("divers")) {
    setNameIdx(5);
  }

  const getListe = () => {
    console.log(type);
    var url = "";
    if (type.id === "IMAGERY") {
      url = apiMedical.getListImagery;
    }
    if (type.id === "BIOLOGIC_ANALYSE") {
      url = apiMedical.getListBiology;
    }
    if (type.id === "SPECIALIZED_EXAM") {
      url = apiMedical.getListExamen;
    }
    url !== "" &&
      requestDoctor
        .get(url, header)
        .then((res) => {
          //console.log(res.data);
          setDataList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
  };
  const get = () => {
    requestPatient
      .get(apiMedical.get + "/" + user.cni + "?medicalType=" + type.id, header)
      .then((res) => {
        console.log(res.data);
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
  const makeSearch = (e) => {
    e.preventDefault();
    onSearch(e, setList, datas, [
      "entitled",
      "detail",
      "doctor",
      "dateElaboration",
    ]);
  };
  const onDelete = (id) => {
    //e.preventDefault();
    console.log(id);
    requestPatient
      .delete(apiMedical.delete + "/" + id + "?type=" + type.id)
      .then((res) => {
        console.log("suppression ok");
        setRefresh(refresh + 1);

        //setModalNotifyMsg("Suppression réussie !")
        notify.current.click();
        //setDelete([]);
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
            data-bs-target={"#modalEdit" + type.id}
            onClick={(e) => {
              setEditValue({ id: "", entitled: "", content: "" });
            }}
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
                  Compte rendu ID
                </th>
                <th scope="col">Intitulé</th>
                <th scope="col">Date d’élobaration</th>
                <th scope="col">Auteur</th>
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
                      <span className="text-bold">CR-0218374</span>
                    </td>
                    <td>
                      <span className="text-bold">{data.entitled}</span>
                    </td>
                    <td>
                      <span className="text-bold">{data.dateElaboration}</span>
                    </td>
                    <td>
                      <div className="d-inline-block me-2 align-middle">
                        <img src={user} alt="" />
                      </div>
                      <div className="d-inline-block align-middle">
                        <span className="text-bold">{data.doctor}</span>
                        <br />
                        <span>Psychiatre</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="btn-group">
                      <div className="d-inline-block mx-1">
                          <img
                            title="Voir le rendez vous"
                            data-bs-toggle="modal"
                            data-bs-target="#viewPara"
                            onClick={(e) => {
                              e.preventDefault();
                              //getDetail(data.uuid);
                              setDataView(data);
                              console.log(data)
                            }}
                            src={view}
                            alt=""
                          />
                        </div>
                        <div className="d-inline-block mx-1">
                          <img
                            title="Éditer les données"
                            data-bs-toggle="modal"
                            data-bs-target={"#modalEdit" + type.id}
                            onClick={(e) => {
                              e.preventDefault();
                              setEditValue({
                                id: data.id,
                                entitled: data.entitled,
                                content: data.detail,
                              });
                            }}
                            src={edit}
                            alt=""
                          />
                        </div>
                        <div className="d-inline-block mx-1">
                          <img
                            title="Supprimer les données"
                            data-bs-toggle="modal"
                            data-bs-target={"#deleteData" + data.id}
                            onClick={(e) => {
                              e.preventDefault();
                              initSelected.idData = data.id;
                              initSelected.title = "type.title";
                              setSelectedData(initSelected);
                            }}
                            src={del}
                            alt=""
                          />
                        </div>
                        <DeleteModal
                          id={data.id}
                          modal={"deleteData" + data.id}
                          title={"Supprimer " + seletedData.title}
                          data={seletedData}
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
      <ModalMedical
        id={"modalEdit" + type.id}
        title={type.title}
        type={type.id}
        oldValue={editValue}
        refresh={get}
        list={dataList}
      />
<div className="modal fade" id="viewPara">
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
                <span className="fw-bold">Intitulé</span> <br />
                <span>{dataView.entitled}</span>
              </p>
              <p className="p-0">
                <span className="fw-bold">Détails</span> <br />
                <span>{dataView.detail}</span>
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
      <div className="modal fade" id="notify">
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

            <div className="modal-body">Suppression réussie !</div>

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
      <input
        type="hidden"
        ref={notify}
        data-bs-toggle="modal"
        data-bs-target="#notify"
        onClick={(e) => {
          e.preventDefault();
        }}
      />
    </div>
  );
};

export default DonneeCompteRendu;
