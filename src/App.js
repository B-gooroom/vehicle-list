import Header from './components/Header.js';
import Filter from './components/Filter.js';
import ModelClasses from './components/ModelClasses.js';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header></Header>
        <hr />
        <div className="container">
          <Filter></Filter>
          <hr />
          <Routes>
            <Route path="/list" element={<ModelClasses />}></Route>
            <Route path="*" element={<Navigate replace to="/list" />}></Route>
          </Routes>
          <hr />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App;
