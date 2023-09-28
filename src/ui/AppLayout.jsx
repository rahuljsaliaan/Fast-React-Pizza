import Header from "./Header";
import AppLoader from "./AppLoader";
import CartOverview from "../features/cart/CartOverview";
import { Outlet, useNavigation } from "react-router-dom";

function AppLayout() {
  const navigation = useNavigation();
  // set isLoading based on application navigation state
  const isLoading = navigation.state === "loading";

  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto] ">
      {isLoading && <AppLoader />}
      <Header />

      <div className="overflow-scroll">
        <main className="mx-auto max-w-3xl">
          {/* children routes rendered */}
          <Outlet />
        </main>
      </div>

      <CartOverview />
    </div>
  );
}

export default AppLayout;
