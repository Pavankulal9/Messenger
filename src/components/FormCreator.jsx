import React from "react";

const FormCreator = ({
  formik,
  title,
  loading,
  errorMessage,
  inputs,
  buttonText,
}) => {
  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    formik;

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h1>{title}</h1>
        {inputs &&
          inputs.map((input) => (
            <div className="input-block" key={input.name}>
              <label htmlFor={input.name}>{input.label}</label>
              <input
                type={input.type}
                name={input.name}
                placeholder={input.placeholder}
                value={values[input.name]}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete={input.name === "password" ? "new-password" : ""}
              />
              {errors[input.name] && touched[input.name] && (
                <p id="error-message">{errors[input.name]}</p>
              )}
            </div>
          ))}
        {errorMessage && <p id="error-message">{errorMessage}</p>}
        <div className="submit-button">
          <button disabled={loading} type="submit">
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormCreator;
