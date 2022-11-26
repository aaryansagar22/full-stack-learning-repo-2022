import { Routes, Route } from "react-router-dom";
import FullScreenLayout from "./components/Layouts/FullScreenLayout";
import DefaultLayout from "./components/Layouts/DefaultLayout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import AuthContext, { useProvideAuth } from "./contexts/AuthContext";

function App() {
  return (
    <AuthContext.Provider value={useProvideAuth()}>
      <Routes>
        {/* In Class TODO: Add the second route for the homepage */}
        <Route path="/" element={<DefaultLayout></DefaultLayout>}>
          <Route index element={<HomePage></HomePage>} />
        </Route>
        <Route path="/login" element={<FullScreenLayout></FullScreenLayout>}>
          {/* Index Route: A child route with no path that renders in the parent's outlet at the parent's URL */}
          <Route index element={<LoginPage></LoginPage>}></Route>
        </Route>
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
