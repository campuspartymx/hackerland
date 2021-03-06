import React, { PropTypes } from "react";


function TextWidget({
  schema,
  id,
  placeholder,
  value,
  required,
  disabled,
  readonly,
  onChange
}) {
  return (
    <div>
      <textarea
        id={id}
        className="form-control"
        value={typeof value === "undefined" ? "" : value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        rows="7"
        onChange={(event) => onChange(event.target.value)} />
      <small>This field supports markdown</small>
    </div>
  );
}

if (process.env.NODE_ENV !== "production") {
  TextWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    required: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default TextWidget;