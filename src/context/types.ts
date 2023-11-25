export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
   idToken: string, 
   userType: string
}

export type UserDataType = {
   id: number
   email: string
   avatar?: string
   fullname?: string
   username: string
   company?: string | null
   accessToken?: string
   dateOfBirth: string
   address?: string
   userType: string
   jobTitle?: string
   search?: string,
   socialTitle?: string,
   phoneNumber?:string
   seekingStatus?: string,
   status?: string
   userTags?: any[]
}

export type AuthValuesType = {
   loading: boolean
   logout: () => void
   user: UserDataType | null
   setLoading: (value: boolean) => void
   setUser: (value: UserDataType | null) => void
   login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}
