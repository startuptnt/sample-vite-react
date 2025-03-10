import { Admin, Resource } from 'react-admin';
import { BrowserRouter } from 'react-router-dom';

import authProvider from './providers/Auth0AuthProvider';
import RESTdataProvider from './providers/JWTDataProvider';
const dataProvider = RESTdataProvider('https://apibeta.startuptnt.com/api');

import CustomLoginPage from './components/LoginPage.jsx'
import InvestmentDashboard from './components/Dashboard/investmentDashboard.jsx';
import StartupViewShow from './components/Startups/StartupViewShow.jsx';

import DashboardIcon from '@mui/icons-material/Dashboard';

const App = () => (
  <BrowserRouter>
    <Admin loginPage={CustomLoginPage} dataProvider={dataProvider} authProvider={authProvider}>
      <Resource name="investment" list={InvestmentDashboard} icon={DashboardIcon} options={{ label: 'Dashboard' }} />
      <Resource name="startup" show={StartupViewShow} />
    </Admin>
  </BrowserRouter>
);

export default App;
