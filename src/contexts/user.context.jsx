import { createContext, useState } from "react";

//Actuall values u want to access
export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
});

//Provider
//In other words this will give the childrens the access to set the values and get the values
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const value = { currentUser, setCurrentUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

//Example of what it will do
//  <UserProvider>
//      <app/>
//  </UserProvider>

//The app is the children in this case
