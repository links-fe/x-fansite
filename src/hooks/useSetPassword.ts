import { useRef, useState } from 'react'

const useSetPassword = () => {
  const setPasswordInputRef = useRef<any>(null)
  const [password, setPassword] = useState<string>('')
  const changePassword = (val: string) => {
    setPassword(val)
  }
  const updateInputErrText = (txt: string) => {
    if (!setPasswordInputRef.current) {
      console.error('setPasswordInputRef.current is null', setPasswordInputRef.current)
      return
    }
    setPasswordInputRef.current.changeInputErrText(txt)
  }
  const checkZxcvbn = (): boolean => {
    if (!setPasswordInputRef.current) {
      console.error('setPasswordInputRef.current is null', setPasswordInputRef.current)
      return false
    }
    return setPasswordInputRef.current.handleZxcvbn(password)
  }
  return {
    setPasswordInputRef,
    password,
    changePassword,
    updateInputErrText,
    checkZxcvbn,
  }
}
export default useSetPassword
