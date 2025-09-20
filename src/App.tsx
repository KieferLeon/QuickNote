import { useState } from 'react';
import Grid from './components/Grid/Grid';
import EditModeButton from './components/EditModeButton/EditModeButton';

function App() {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <>
      <EditModeButton
        toggle={() => setIsEditMode(!isEditMode)}
      />
      <Grid
        isEditMode={isEditMode}
      />
    </>
  );
}

export default App;
