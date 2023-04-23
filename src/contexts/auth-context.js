import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { auth } from 'src/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
const firebaseAuth = getAuth();
import { signOut as firebaseSignOut } from 'firebase/auth';
const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        // User is signed in.
        const userData = {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
        };

        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: userData,
        });
      } else {
        // User is signed out.
        dispatch({
          type: HANDLERS.INITIALIZE,
        });
      }
    });
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const skip = () => {
    try {
      window.sessionStorage.setItem('authenticated', 'true');
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: '5e86809283e28b96d2d38537',
      avatar: '/assets/avatars/avatar-anika-visser.png',
      name: 'Anika Visser',
      email: 'anika.visser@devias.io'
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: {
        id: user.uid,
        name: user.displayName, // добавьте это поле
        email: user.email,
      },
    });
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: {
          id: user.uid,
          email: user.email
        }
      });
      console.log(`Успешная авторизация ${user.email}`);

    } catch (err) {
      throw new Error('Пожалуйста, проверьте свою электронную почту и пароль'),
      console.log("Не верный запрос на сервер!");
    }
  };

  const signUp = async (email, name, password) => {
    throw new Error('Sign up is not implemented');
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(firebaseAuth); // Добавьте эту строку
      dispatch({
        type: HANDLERS.SIGN_OUT
      });
    } catch (error) {
      console.error("Ошибка при выходе из аккаунта: ", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
