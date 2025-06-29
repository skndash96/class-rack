import React, { createContext, useContext, useState } from "react";

interface TopbarContextState {
  title?: string | React.ReactNode;
  rightActions?: React.ReactNode[];
  isBackButtonVisible?: boolean;
}

interface TopbarContextProps {
  topBarOptions: TopbarContextState;
  setTopBarOptions: (newState: TopbarContextState) => void;
}

const TopbarContext = createContext({})

export const TopbarProvider = ({
  children
}: React.PropsWithChildren) => {
  const [topBarOptions, _setTopBarOptions] = useState<TopbarContextState>({});

  const setTopBarOptions = (newState: TopbarContextState) => {
    _setTopBarOptions(prevState => ({
      ...prevState,
      ...newState
    }));
  }

  return (
    <TopbarContext.Provider value={{ topBarOptions, setTopBarOptions}}>
      {children}
    </TopbarContext.Provider>
  );
}

export const useTopbar = () => {
  const context = useContext(TopbarContext);
  if (!context) {
    throw new Error("useTopbar must be used within a TopbarProvider");
  }
  return context as TopbarContextProps;
}