// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import BuilderPage from './builder/BuilderPage';
import { UniversalBuilderProvider } from './context/UniversalBuilderContext';
import { WorkflowProvider } from './context/WorkflowContext';


function App() {
  // const [count, setCount] = useState(0)

 return (
      <UniversalBuilderProvider>
        <WorkflowProvider>
          <BuilderPage />
        </WorkflowProvider>
      </UniversalBuilderProvider>
  );
}

export default App
