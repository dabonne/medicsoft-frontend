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
import { apiMedical } from "../../../services/api";
import { AppContext } from "../../../services/context";
import DeleteModal from "../../../components/DeleteModal";
import Loading from "../../../components/Loading";
import requestDoctor from "../../../services/requestDoctor";

const AntecedentPersonnel = ({ setNameIdx, type = {} }) => {
  const authCtx = useContext(AppContext);
  const { user } = authCtx;
  const [datas, setDatas] = useState([]);
  const [search, setSearch] = useState("");
  const [stopLoad, setStopLoad] = useState(false);
  const [list, setList] = useState("");
  const [editValue, setEditValue] = useState();
  const [refresh, setRefresh] = useState(0);
  const notify = useRef();
  const header = {
    headers: { Authorization: `${user.token}` },
  };
  setNameIdx(1);
  useEffect(() => {
    console.log(type);
    get();
  }, [refresh]);

  const get = () => {
    requestDoctor
      .get(apiMedical.antecedentRecord + "/" + user.cni, header)
      .then((res) => {
        console.log(res.data);
        setStopLoad(true)
        setDatas(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
  const onDelete = (id) => {
    //e.preventDefault();
    console.log(id);
    requestPatient
      .delete(apiMedical.deleteFamily + "/" + id)
      .then((res) => {
        console.log("suppression ok");
        get();
        //setModalNotifyMsg("Suppression réussie !")
        notify.current.click();
        //setDelete([]);
        setRefresh(refresh + 1);
      })
      .catch((error) => {
        console.log(error);
      });
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
        <div className="col-3 d-flex justify-content-end align-items-center">
          <div className="btn btn-secondary me-2"
          onClick={ e =>{
            e.preventDefault()
            window.open(
              "https://doctor-management.herokuapp.com/doctor-management/external-api/doctor/medical-record/synthesis-report/" +
                user.cni+"/"+user.organisationRef
            );
          }}
          >Synthèse</div>
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target={"#modalEdit" + type.id}
          >
            Ajouter
          </button>
        </div>
      </div>

      <Loading data={datas} stopLoad={stopLoad}>
      <div className="table-responsive-lg">
        <table className="table table-striped align-middle">
          <thead>
            <tr className="align-middle">
              <th scope="col" className="border-raduis-left">
                Antécédent ID
              </th>
              <th scope="col">Antecedent</th>
              {/*<th scope="col">Lien de parenté</th>*/}
              <th scope="col" className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {datas.map((data, idx) => {
              //data.checkValue = false
              return (
                <tr key={idx}>
                  <td>
                    <span className="text-bold">PRESC-0218374</span>
                  </td>
                  <td>
                    <span className="text-bold">{data.antecedentLabel}</span>
                  </td>
                  {/*<td>
                  {data.parent}
                  </td>*/}
                  <td className="text-center">
                    <div className="btn-group">
                      <div className="d-inline-block mx-1">
                        <img
                          title="Éditer les données"
                          data-bs-toggle="modal"
                          data-bs-target={"#modalEdit" + type.id}
                          onClick={(e) => {
                            e.preventDefault();
                            setEditValue(data);
                            //setDelete(["" + data.employeeReference]);
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
                            //setDelete(["" + data.employeeReference]);
                            setEditValue(data);
                          }}
                          src={del}
                          alt=""
                        />
                      </div>
                      <DeleteModal
                        id={data.id}
                        modal={"deleteData" + data.id}
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

      <ModalMedicalAntecedent
        id={"modalEdit" + type.id}
        title={type.title}
        type={type.id}
        oldValue={editValue}
        refresh={get}
      />

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

export default AntecedentPersonnel;
