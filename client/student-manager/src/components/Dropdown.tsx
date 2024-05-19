interface DropdownProps {
  dropdownId: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

function Dropdown({
  dropdownId,
  label,
  options,
  value,
  onChange,
}: DropdownProps) {
  const optionElements = options.map((op) => (
    <option key={op} value={op}>
      {op}
    </option>
  ));

  const handleDropdownChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    onChange(value);
  };

  return (
    <div>
      <label htmlFor={dropdownId}>{label}</label>
      <select
        id={dropdownId}
        value={value}
        onChange={(e) => handleDropdownChange(e)}
      >
        {optionElements}
      </select>
    </div>
  );
}

export default Dropdown;
