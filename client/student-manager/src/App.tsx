import { StudentsPageProvider } from "./contexts/StudentsPageContext";
import { ServerStatusProvider } from "./contexts/ServerStatusContext";
import { AuthenticationProvider } from "./contexts/AuthenticationContext";
import RoutingComponent from "./components/RoutingComponent";

function App() {
  return (
    <AuthenticationProvider>
      <ServerStatusProvider>
        <StudentsPageProvider>
          <RoutingComponent />
        </StudentsPageProvider>
      </ServerStatusProvider>
    </AuthenticationProvider>
  );
}

export default App;
