import React from 'react'
import styled from '@emotion/styled'

export const Container = styled.div`
    display: grid;
    place-items:center;
    height: 100vh;
    width: 100vw;
`

export const CenteredWrapper = styled.div`
    width: 440px;
    padding: 20px;
    @media (max-width: 768px) {
        width: 70%;
    }
    @media (max-width: 480px) {
        width: 100%;
    }
`

const CenterItems = props => {
    return (
        <Container>
            <CenteredWrapper>
                { props.children }
            </CenteredWrapper>
        </Container>
    );
};

export default CenterItems