import { forwardRef } from "react";

// TODO: change color of radio btn
type RadioInputProps = {
  label: string;
  inputId: string;
  disabled?: boolean;
  question_id: string;
} & React.HTMLAttributes<HTMLInputElement>;

const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(
  ({ inputId, disabled = false, className, question_id, ...rest }, ref) => (
    <input
      id={inputId}
      type="radio"
      value=""
      name={`default-radio-${question_id}`}
      className={`w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500  dark:ring-offset-gray-600 opacity-70 checked:bg-indigo-600 ${className}`}
      disabled={disabled}
      {...rest}
      ref={ref}
    />
  )
);

RadioInput.displayName = "RadioInput";

export default RadioInput;
