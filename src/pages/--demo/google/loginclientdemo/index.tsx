'use client'

import useGoogleLogin from './components/hook'

export default function Page() {
  function onSuccess(data: any) {
    console.log('data: ', data)
  }

  function onFailure(errorMessage: any) {
    console.log('errorMessage: ', errorMessage)
  }

  const { loginButtonRef, testLogin } = useGoogleLogin({
    onSuccess,
    onFailure,
  })
  return (
    <div>
      <div ref={loginButtonRef}>
        <button>Log in</button>
      </div>

      <button onClick={testLogin}>test login</button>
    </div>
  )
}
