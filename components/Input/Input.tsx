import { forwardRef } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, ...rest }, ref) => (
    <input
      className={`
      form-control
      block
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-indigo-500 focus:outline-none ${className}`}
      type="text"
      ref={ref}
      {...rest}
    />
  )
);

Input.displayName = "Input";

export default Input;
