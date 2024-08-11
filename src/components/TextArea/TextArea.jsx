import React from "react";

const TextArea = ({
  posClassName,
  labelClass,
  textAreaClass,
  label,
  id,
  rows,
  placeholder,
  disabled = false,
  value,
  onChangeCallBack,
}) => {
  return (
    <div className={posClassName}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <textarea
        id={id}
        className={textAreaClass}
        name={id}
        rows={rows || 3}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={(e) => onChangeCallBack(e)}
      ></textarea>
    </div>
  );
};

export default TextArea;
