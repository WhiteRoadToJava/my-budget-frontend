import React from "react";
import DropDown from "../elements/DropDown";
import i18n from "../../configuration/i18n";

// DropDown works with plain strings; this shows translated labels
// and reports the matching enum value (e.g. "OWED_BY_ME")
const LabeledDropDown = ({ label, name, options, value, onChange, disabled }) => {
  const labels = options.map((o) => i18n.t(o.label));
  const current = options.find((o) => o.value === value);

  if (disabled) {
    return (
      <div>
        <label htmlFor={name}>{label}</label>
        <input id={name} value={current ? i18n.t(current.label) : ""} disabled readOnly />
      </div>
    );
  }

  return (
    <DropDown
      label={label}
      name={name}
      list={labels}
      value={current ? i18n.t(current.label) : ""}
      onChange={(e) => {
        const picked = options.find((o) => i18n.t(o.label) === e.target.value);
        if (picked) onChange(picked.value);
      }}
    />
  );
};

export default LabeledDropDown;
