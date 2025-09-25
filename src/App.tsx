import React, { useState } from "react";
import './styles/App.css';
import InputField from './components/common/InputField/InputField';

function App() {
  const [name, setName] = useState("");

  const handleNameChange = (event: React.FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  return (
    <div className="App">

      <InputField
        label="מס' אישי"
        type="text"
        value={name}
        onChange={handleNameChange}
      />

      <p>Your input: {name}</p>
    </div>
  );
}

export default App;
