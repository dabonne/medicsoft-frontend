const InputField = ({ type, label, name, value, options, onChange, formik, placeholder, inputClass = "col-md-12"}) => {
    const handleChangE = (event) => {
      //console.log(event.target.name, event.target.value);
      onChange(event.target.name, event.target.value);
    };
  
    const handleChangEImage = (event) => {
      onChange(event.target.name, event.target.files[0]);
    }
  
    if (type === "text") {
      return (
        <div className="col-md-12 mb-3">
          <div className="form-floating">
            <input
              className="form-control form-control-sm form-floating-height"
              type="text"
              id={name}
              name={name}
              value={formik.values[name]}
              placeholder={label}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <label htmlFor={name} className="form-label mb-4">
              {label}
            </label>
          </div>
          {formik.touched[name] && formik.errors[name] ? (
          <div className="text-danger">{formik.errors[name]}</div>
        ) : null}
        </div>
      );
    }

    if (type === "text2") {
      return (
        <div className={inputClass + " mb-3"}>
          <input
              className="form-control form-control-sm form-floating-height"
              type="text"
              id={name}
              name={name}
              value={formik.values[name]}
              placeholder={placeholder}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          {formik.touched[name] && formik.errors[name] ? (
          <div className="text-danger">{formik.errors[name]}</div>
        ) : null}
        </div>
      );
    }

    if (type === "textarea") {
      return (
        <div className="col-md-12 mb-3">
          <textarea
              className="form-control form-control-sm form-floating-height"
              type="textarea"
              id={name}
              name={name}
              value={formik.values[name]}
              placeholder={placeholder}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows="4"
            ></textarea>
          {formik.touched[name] && formik.errors[name] ? (
          <div className="text-danger">{formik.errors[name]}</div>
        ) : null}
        </div>
      );
    }

    if (type === "number") {
      return (
        <div className="col-md-12">
          <div className="form-floating mb-3">
            <input
              className="form-control form-control-sm form-floating-height"
              type="number"
              id={name}
              name={name}
              value={formik.values[name]}
              placeholder={label}
              onChange={formik.handleChange}
            />
            <label htmlFor={name} className="form-label mb-4">
              {label}
            </label>
          </div>
        </div>
      );
    }
  
    if (type === "date") {
      return (
        <div className="col-md-12">
          <div className="mb-3">
            <input
              className="form-control form-control-sm form-floating-height"
              type="date"
              id={name}
              name={name}
              value={formik.values[name]}
              placeholder={label}
              onChange={formik.handleChange}
            />
          </div>
        </div>
      );
    }

    if (type === "time") {
      return (
        <div className="col-md-12">
          <div className="mb-3">
            <input
              className="form-control form-control-sm form-floating-height"
              type="time"
              id={name}
              name={name}
              value={formik.values[name]}
              placeholder={label}
              onChange={formik.handleChange}
            />
          </div>
        </div>
      );
    }
  
    if (type === "file") {
      return (
        <div className="col-md-12">
          <div className="form-floating mb-3">
            <input
              className="form-control form-control-sm form-floating-height"
              type="file"
              id={name}
              name={name}
              //value={formik.values[name]}
              placeholder={label}
              onChange={formik.handleChange}
            />
            <label htmlFor={name} className="form-label mb-4">
              {label}
            </label>
          </div>
        </div>
      );
    }
  
    if (type === "select") {
      return (
        <div className="col-md-12 mb-3">
          <select
            className="form-select"
            id={name}
            name={name}
            value={formik.values[name]}
            onChange={formik.handleChange}
          >
            <option>{placeholder}</option>
            {options.map((option, idx) => (
              <option key={"select"+idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    }
    if (type === "select2") {
      return (
        <div className="col-md-12 mb-3">
          <select
            className="form-select"
            id={name}
            name={name}
            value={formik.values[name]}
            onChange={formik.handleChange}
          >
            <option>{placeholder}</option>
            {Object.keys(options).map((key, idx) => (
              <option key={"select2"+idx} value={key}>
                {options[key]}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (type === "select3") {
      return (
        <div className="col-md-12 mb-3">
          <select
            className="form-select"
            id={name}
            name={name}
            value={formik.values[name]}
            onChange={formik.handleChange}
          >
            <option>{placeholder}</option>
            {(options).map((option, idx) => (
              <option key={idx} value={option.uuid}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }
    return null;
  };
  
  export default InputField;
  