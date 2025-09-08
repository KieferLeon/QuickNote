import { useState } from 'react'
import Grid from './components/grid/grid'
import BaseComponent from './components/element/BaseComponent'

function App() {
  const [] = useState(0)

  return (
    <Grid> 
      <BaseComponent/>
    </Grid>
  )
}

export default App
