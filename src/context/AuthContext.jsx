import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../services/firebase";

const AuthContext =
  createContext();

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (
          firebaseUser
        ) => {
          try {
            if (
              firebaseUser
            ) {
              const adminRef =
                doc(
                  db,
                  "admins",
                  firebaseUser.uid
                );

              const adminSnap =
                await getDoc(
                  adminRef
                );

              if (
                adminSnap.exists()
              ) {
                setUser({
                  uid:
                    firebaseUser.uid,

                  email:
                    firebaseUser.email,

                  ...adminSnap.data(),
                });
              } else {
                setUser(
                  null
                );
              }
            } else {
              setUser(
                null
              );
            }
          } catch (
            error
          ) {
            console.error(
              error
            );

            setUser(
              null
            );
          }

          setLoading(
            false
          );
        }
      );

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth =
  () =>
    useContext(
      AuthContext
    );