// ** React Imports
import { createContext, useEffect, useState, ReactNode } from "react"
import { useTranslation } from "react-i18next"

// ** Next Import
import { useRouter } from "next/router"

// ** Types
import {
  AuthValuesType,
  LoginParams,
  ErrCallbackType,
  UserDataType,
} from "./types"

import * as ServiceAuth from "@/services/auth"
import { clearLocalUserData, setLocalUserData } from "@/utils"


// ** Other libraries

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
}

const AuthContext = createContext(defaultProvider)

type Props = {
   children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)

  // ** Hooks
  const router = useRouter()

  // ** Translation
  const { t } = useTranslation()

  const initAuth = async (): Promise<void> => {
    const storedToken = window.localStorage.getItem("access_token")!
    if (storedToken) {
      setLoading(true)

      await ServiceAuth.getUserInfo()
        .then(async (response) => {
          const userInfo = response.data

          setLoading(false)
          setUser({
            ...userInfo,
          })
        })
        .catch((err) => {
          setUser(null)
          clearLocalUserData()
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    initAuth()
  }, [router.route])

  const handleLogin = (
    params: LoginParams,
    errorCallback?: ErrCallbackType
  ) => {
    ServiceAuth.loginWithGoogle(params)
      .then(async (response) => {
        const { accessToken, refreshToken } = response?.data
        setLocalUserData(accessToken, refreshToken)
      })
      .then(() => {
        initAuth()
      })
      .catch((err) => {
        if (errorCallback) errorCallback(err)
      })
  }
 
  const handleLogout = () => {
    setLoading(true)
    ServiceAuth.logoutUser().then((res) => {
      setUser(null)
      clearLocalUserData()
      setLoading(false)
      if(window.location.href?.includes('/profile') || window.location.href?.includes('/hiring')) {
        window.location.href = '/'
      }
    })
  }
 
  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
  }
 
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}
 
export { AuthContext, AuthProvider }