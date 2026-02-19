'use strict';

import DefaultLayout from "@/components/layouts/DefaultLayout";
import WelcomeScreen from "./WelcomeScreen/WelcomeScreen";

const App = () => {
  return (
    <DefaultLayout>
      <WelcomeScreen />
    </DefaultLayout>
  );
};

export default App;