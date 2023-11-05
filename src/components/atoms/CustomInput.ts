import styled from "@emotion/styled";

const CustomInput = styled.input`
  border: none;
  border-bottom: 2px solid var(--gray);
  font-size: 1.5rem;
  padding: 0.5rem;
  width: 100%;
  outline: none;
  transition: var(--transition);

  &::placeholder {
    font-size: 1rem;
  }

  &:focus {
    border-color: var(--primary);

    & + label {
      color: var(--primary);
    }
  }

  &:disabled {
    border-color: var(--gray-light);
    background-color: transparent;
  }

  &.error {
    border-color: var(--red);
    color: var(--red);
  }
`;

export default CustomInput;
