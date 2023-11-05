import styled from "@emotion/styled"

export const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const FlexColumn = styled(Flex)`
  flex-direction: column;
`

export const FlexRow = styled(Flex)``

export const FlexJustifyCenter = styled(Flex)`
  justify-content: center;
`

export const FlexJustifyBetween = styled(Flex)`
  justify-content: space-between;
`

export const FlexJustifyEnd = styled(Flex)`
  justify-content: flex-end;
`