import Header from "./Header";
import AppLoader from "./AppLoader";
import CartOverview from "../features/cart/CartOverview";
import { Outlet, useNavigation } from "react-router-dom";

function AppLayout() {
  const navigation = useNavigation();
  // set isLoading based on application navigation state
  const isLoading = navigation.state === "loading";

  return (
    <div className="layout">
      {isLoading && <AppLoader />}
      <Header />

      <main>
        {/* children routes rendered */}
        <Outlet />
      </main>

      <CartOverview />
    </div>
  );
}

export default AppLayout;
