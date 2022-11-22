import React from "react";
import danger from "../assets/imgs/ic-danger.png"
import success from "../assets/imgs/ic-success.png"

const FormNotify = ({ bg, title, message }) => {
  return (
    <div className={"border-1 border-radius w-100 py-4 px-2 bg-"+bg}>
      <div className={"row px-2 "}>
        <div className="col-2">
            {
                (bg === "danger") ? 
                    <img src={danger} alt="" /> :
                    (bg === "success") ? 
                        <img src={success} alt="" /> :
                        (bg === "loading") ?
                            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>: ""
            }
        </div>
        <div className="col-10">
            <span className="text-bold">{title}</span>
            <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default FormNotify;
