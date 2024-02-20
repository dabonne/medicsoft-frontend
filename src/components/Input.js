import { useState } from "react";
//import { EyeFill } from "./imgs/EyeFill";
//import { EyeSlash } from "./imgs/EyeSlash";
import intersect from "../assets/imgs/intersect.png";

const Input = ({ type, label, name, placeholder, formik, options = [] }) => {
    const [viewPassord, setViewPassword] = useState(false);
    if (type === "text") {
        return (
            <div className="mb-3">
                <label htmlFor={name} className="form-label fw-bold1 ">
                    {label}
                </label>
                <input
                    className="form-control form-control-sm1 form-floating-height1"
                    type="text"
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    onChange={formik.handleChange}
                    value={formik.values[name]}
                />
            </div>
        );
    }

    if (type === "textarea") {
        return (
            <div className="mb-3">
                <label htmlFor={name} className="form-label fw-bold1 ">
                    {label}
                </label>
                <textarea
                    className="form-control"
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    onChange={formik.handleChange}
                    value={formik.values[name]}
                    rows={3}
                ></textarea>
            </div>
        );
    }

    if (type === "select") {
        return (
            <div className="mb-3">
                <label htmlFor={name} className="form-label">
                    {label}
                </label>
                <select
                    className="form-select"
                    id={name}
                    name={name}
                    onChange={formik.handleChange}
                    value={formik.values[name]}
                >
                    <option value={""}>{placeholder}</option>
                    {options.map((data, idx) => {
                        return (
                            <option value={data.uuid} key={data.uuid}>
                                {data.label}
                            </option>
                        );
                    })}
                </select>
            </div>
        );
    }

    if (type === "password") {
        return (
            <div className="mb-3 position-relative">
                <label htmlFor={name} className="form-label fw-bold ">
                    {label}
                </label>
                <input
                    className="form-control form-control-sm form-floating-height"
                    type={viewPassord ? "text" : "password"}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    onChange={formik.handleChange}
                    value={formik.values[name]}
                />
                <span
                    className="position-absolute"
                    style={{ bottom: "10px", right: "10px" }}
                    onClick={(e) => setViewPassword((e) => !e)}
                >
                    {/*viewPassord ? <EyeFill /> : <EyeSlash />*/}
                </span>
            </div>
        );
    }

    if (type === "file") {
        return (
            <div className="mb-3">
                <label htmlFor={name} className="form-label">
                    {label}
                </label>
                <input
                    className="form-control"
                    type="file"
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    onChange={(e) => {
                        formik.setFieldValue(name, e.target.files[0]);
                    }}
                />
            </div>
        );
    }
    if (type === "files") {
        return (
            <div className="mb-3">
                <label htmlFor={name} className="form-label">
                    {label}
                </label>
                <input
                    className="form-control"
                    type="file"
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    onChange={(e) => {
                        formik.setFieldValue(name, e.target.files);
                    }}
                    multiple
                />
            </div>
        );
    }

    if (type === "date") {
        return (
            <div className="mb-3">
                <label htmlFor={name} className="form-label fw-bold1 ">
                    {label}
                </label>
                <input
                    className="form-control form-control-sm1 form-floating-height1"
                    type="date"
                    id={name}
                    name={name}
                    onChange={formik.handleChange}
                    value={formik.values[name]}
                />
            </div>
        );
    }

    if (type === "radio") {
        return (
            <div className="mb-31">
                
                <input
                    className="form-check-input me-2"
                    type="radio"
                    id={name}
                    name={name}
                    onChange={formik.handleChange}
                    value={formik.values[name]}
                />
                <label htmlFor={name} className="form-label fw-bold1 ">
                    {" "+ label}
                </label>
            </div>
        );
    }

    if (type === "checkbox") {
        return (
            <div className={"mb-0 "}>
                <div className="form-check custom-checkbox">
                    <input
                        className={` form-check-input  ${formik.values[name] && " bg-primary"}`}
                        type="checkbox"
                        id={name}
                        name={name}
                        onChange={formik.handleChange}
                        value={formik.values[name]}
                    />
                    <label
                        className="form-check-label "
                        htmlFor="flexCheckIndeterminate"
                    >
                        {label}
                    </label>
                </div>
            </div>
        );
    }
};

export default Input;
