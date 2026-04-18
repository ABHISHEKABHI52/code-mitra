function InputBox({ value, onChange }) {
  return (
    <div className="card">
      <label htmlFor="userInput" className="label">
        Paste your error or code
      </label>
      <textarea
        id="userInput"
        className="textarea"
        rows="8"
        placeholder="Example: NameError: name 'x' is not defined"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default InputBox;
