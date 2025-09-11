import { useState } from 'react';
import Grid from './components/Grid/Grid';
import BaseComponent from './components/BaseComponent/BaseComponent';
import EditModeButton from './components/EditModeButton/EditModeButton';

function App() {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <>
      <EditModeButton
        toggle={() => setIsEditMode(!isEditMode)}
      />
      <Grid>
        <BaseComponent isEditMode={isEditMode} />
      </Grid>
    </>
  );
}

export default App;
