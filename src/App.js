import './App.css';
import FileUpload from './components/FileUpload';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './components/Home';

function App() {
  return (
    <div className="App">
       <Router>
      <div className="App">
      <h2>Start chatting Application</h2>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<FileUpload />} />
        </Routes>
    
    
      </div>
    </Router> 

    </div>
  );
}

export default App;
