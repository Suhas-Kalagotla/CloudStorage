export const InputField = ({ label, value, onChange, type, placeholder, name }) => (
  <>
    <label htmlFor={name}>{label}</label>
    <div>
      <input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        id={name}
        name={name}
      />
    </div>
    <br />
  </>
);
