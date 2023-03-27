import './App.css';
import {BrowserRouter as Router , Routes, Route} from "react-router-dom"
import AuthScreen from './screens/AuthScreen';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';

function App() {
  return (
    <Router>
      <Header />
      <Routes>  
          <Route path='/' element={<HomeScreen />} exact />
          <Route path='/auth' element={<AuthScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
