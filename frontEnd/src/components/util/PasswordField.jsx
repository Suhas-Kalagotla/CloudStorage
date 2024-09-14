export const PasswordField = ({
  label,
  value,
  onChange,
  visible,
  toggleVisibility,
  name,
}) => (
  <>
    <label htmlFor={name}>{label}</label>
    <div className="loginDiv">
      <input
        className="Input"
        value={value}
        onChange={onChange}
        type={visible ? "text" : "password"}
        placeholder="****"
        id={name}
        name={name}
      />
      <button onClick={toggleVisibility} type="button" className="passToggle">
        {visible ? "Hide Password" : "Show Password"}
      </button>
    </div>
    <br />
  </>
);
