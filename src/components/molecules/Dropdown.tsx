import styled from "@emotion/styled"
import { FC, ReactElement, cloneElement, useRef, useState } from "react"
import useClickOutside from "../../hooks/useClickOutside"

interface Props {
  menu: {
    label: string | ReactElement
    onClick?: () => void
  }[]
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  trigger: ReactElement
}

const Dropdown: FC<Props> = ({ menu, trigger, position = "bottom-right" }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dropdownRef = useRef(null)

  useClickOutside(dropdownRef, () => setIsOpen(false))

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <DropdownStyled ref={dropdownRef} position={position}>
      {cloneElement(trigger as any, {
        onClick: toggleDropdown,
        className: "dropdown-toggler"
      })}

      {isOpen && (
        <ul className={`dropdown-menu`}>
          {menu.map((item, index) => (
            <li
              key={index}
              onClick={(e: any) => {
                e.stopPropagation()
                item.onClick && item.onClick()
                setIsOpen(false)
              }}
              className="dropdown-item"
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </DropdownStyled>
  )
}

export default Dropdown

interface DropdownStyledProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

const DropdownStyled = styled.div<DropdownStyledProps>`
  position: relative;

  .dropdown-menu {
    position: absolute;
    list-style: none;
    top: ${({ position }) => position?.startsWith("top") ? "auto" : "100%"};
    right: ${({ position }) => position?.endsWith("right") ? "0" : "auto"};
    bottom: ${({ position }) => position?.startsWith("top") ? "100%" : "auto"};
    left: ${({ position }) => position?.endsWith("right") ? "auto" : "0"};
    min-width: 11rem;
    background-color: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    z-index: 1;
    overflow: hidden;

    .dropdown-item {
      padding: 0.5rem 1rem;
      cursor: pointer;

      &:hover {
        background-color: var(--gray-light);
      }
    }
  }
`