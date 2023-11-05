import { FC, ReactElement } from "react"
import ButtonIcon from "../atoms/ButtonIcon"
import styled from "@emotion/styled"
import ChevronLeftIcon from "../../icons/ChevronLeftIcon"
import { css } from "@emotion/css"
import { NavLink } from "react-router-dom"
import Container from "../atoms/Container"

interface Props {
  title?: string,
  backPath?: string
  rightAction?: ReactElement
}

const Header: FC<Props> = ({ backPath, title, rightAction }) => {

  return (
    <HeaderStyled>
      <Container>
        <div className="header-content">
          <div className="left-panel">
            {backPath &&
            <NavLink to={backPath}>
              <ButtonIcon
                data-testid="back-button"
                size="small"
                bg="white"
                color="primary"
                className={css({ marginLeft: -8 })}
              >
                <ChevronLeftIcon width={36} />
              </ButtonIcon>
            </NavLink>
            }
            {title && <h1>{title}</h1>}
          </div>
          {rightAction && rightAction}
        </div>
      </Container>
    </HeaderStyled>
  )
}

export default Header

const HeaderStyled = styled.header`
  border-bottom: 1px solid var(--gray);
  padding: 2.5rem 0;
  background-color: #00AA13;
  color: #ffffff;

  .header-content{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;

    .left-panel {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
`;
