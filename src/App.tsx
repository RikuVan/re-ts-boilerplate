import * as React from 'react'
import { connect } from 'react-redux'
import { makeApiRequest } from './state/api'
import styled from './styles'
import { Provider as ThemeProvider, Heading, Container } from 'rebass'
import { pathOr } from 'ramda'
import { RootState } from './state/initialState'
import * as P from 'polished'
const randomColor = require('randomcolor')

interface HeaderProps {
  color: string
}

const Header = styled.header`
  background-color: ${(props: HeaderProps) => props.color};
  height: 100px;
  padding: 20px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: space-around;
`

/*
const Btn = styled(ButtonOutline)`
  padding: 10px;
`
*/

interface LetterBtnProps {
  active: boolean
  color: string
}

export const LetterButton: any = styled('button')`
  display: flex;
  min-width: 10px;
  border-radius: 3px;
  font-size: 1rem;
  text-transform: uppercase;
  padding: 5px;
  margin: 5px;
  border: 2px solid black;
  background: ${(props: LetterBtnProps) =>
    props.active ? P.darken(0.2, props.color) : 'white'};
`

interface AppProps {
  makeApiRequest: typeof makeApiRequest
  letters: string[]
  theme?: object
}

interface StateProps {
  currentSelectImageIndex: number
}

class App extends React.Component<AppProps, StateProps> {
  state = { currentSelectImageIndex: 0 }
  componentDidMount() {
    this.props.makeApiRequest({ id: 'breeds' })
  }
  render() {
    const { letters } = this.props
    const color = randomColor({ luminosity: 'light' })
    return (
      <ThemeProvider>
        <Header color={color}>
          <Heading color={P.darken(0.5, color)}>Dogs</Heading>
          <Nav>
            {letters.map((letter, i) => (
              <LetterButton
                key={letter}
                onClick={() => this.setState({ currentSelectImageIndex: i })}
                active={i === this.state.currentSelectImageIndex}
                color={color}
              >
                {letter}
              </LetterButton>
            ))}
          </Nav>
        </Header>
        <Container>hey</Container>
      </ThemeProvider>
    )
  }
}

const mapState = (state: RootState) => ({
  letters: pathOr([], ['api', 'breeds', 'data', 'letters'], state)
})

export default connect(mapState, { makeApiRequest })(App)
