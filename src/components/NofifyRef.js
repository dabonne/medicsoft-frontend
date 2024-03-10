import React from "react";
//pas encore utiliser

const NotifyRef = ({ modalNotifyMsg, notifyRef, setNotifyBg }) => {
  return (
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
                //setModalNotifyMsg("");
                setNotifyBg("");
              }}
            >
              Ok
            </button>
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
          setNotifyBg("")
        }}
      />
    </div>
  );
};

export default NotifyRef;
