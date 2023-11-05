import { FC } from "react"
import Button, { ButtonProps } from "../atoms/Button"
import ButtonIcon, { ButtonIconProps } from "../atoms/ButtonIcon"
import { css } from "@emotion/css"

interface Props {
  children: any,
  onClick?: () => void,
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  isIcon?: boolean
  size?: ButtonIconProps["size"]
  bg?: ButtonProps["bg"]
  color?: ButtonProps["color"]
}

const FloatingActionButton: FC<Props> = ({ children, onClick, position = "bottom-right", isIcon = false, size = "large", bg, color }) => {
  const style = css({
    position: "fixed",
    bottom: position.includes("bottom") ? "1rem" : "unset",
    top: position.includes("top") ? "1rem" : "unset",
    left: position.includes("left") ? "1rem" : "unset",
    right: position.includes("right") ? "1rem" : "unset",
    zIndex: 100
  })
  
  return isIcon ? (
    <ButtonIcon
      onClick={onClick && onClick}
      className={style}
      {...size && { size }}
      {...bg && { bg }}
      {...color && { color }}
    >
      {children}
    </ButtonIcon>
  ) : (
    <Button
      onClick={onClick && onClick}
      className={style}
      {...bg && { bg }}
      {...color && { color }}
    >
      {children}
    </Button>
  )
}

export default FloatingActionButton