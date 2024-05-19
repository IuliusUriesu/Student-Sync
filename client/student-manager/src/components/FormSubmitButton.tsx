interface FormSubmitButtonProps {
  text: string;
}

function FormSubmitButton({ text }: FormSubmitButtonProps) {
  return (
    <div className="mb-6 mx-auto">
      <button type="submit" className="form-submit-btn">
        {text}
      </button>
    </div>
  );
}

export default FormSubmitButton;
