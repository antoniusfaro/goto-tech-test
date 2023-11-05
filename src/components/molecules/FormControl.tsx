import styled from "@emotion/styled"
import { FC } from "react"
import Label from "../atoms/Label"
import Input from "../atoms/CustomInput"

interface Props {
  label: string
  type: string
  value: string
  onChange: any
  error?: string
  fieldName?: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
}

const FormControl: FC<Props> = ({ label, type, value, onChange, error, fieldName, required, placeholder, disabled = false }) => {
  return (
    <FormControlStyled>
      <Label
        htmlFor={fieldName}
        className={error ? "error" : ""}
      >
        {label}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        id={fieldName}
        name={fieldName}
        required={required}
        className={error ? "error" : ""}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && <small className="error">{error}</small>}
    </FormControlStyled>
  )
}

export default FormControl

export const FormControlStyled = styled.div`
  margin-bottom: 1rem;
  width: 100%;

  &:has(input:focus) {
    label {
      color: var(--primary);
    }
  }
  
  .error {
    color: var(--color-error);
  }
`