import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import Image from '@/components/Image'
import { path } from '@/constants'
import { ErrorResponse, FormDataLogin } from '@/types'
import { LoginForm } from './components'
import authApi from '@/api/auth.api'
import { isAxiosUnprocessableEntityError } from '@/utils'
import { AppContext } from '@/contexts'

export default function Login() {
  const navigate = useNavigate()
  const [t] = useTranslation('login')
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const location = useLocation()

  const loginMutation = useMutation({
    mutationFn: (body: FormDataLogin) => authApi.login(body)
  })

  const initialLoginFormValue = {
    email: '',
    password: ''
  }

  const handleLogin = (formValues: FormDataLogin) => {
    loginMutation.mutate(formValues, {
      onSuccess: async (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)

        if (location?.state) {
          navigate(location.state)
        } else {
          navigate(path.product)
        }
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<any>>(error)) {
          toast.error(error.response?.data?.message)
        }
      }
    })
  }

  return (
    <div className='flex h-screen items-center justify-center bg-[#efefef]'>
      <Helmet>
        <title>Login | Tiki Clone</title>
        <meta name='description' content='Login into Tiki Clone project' />
      </Helmet>
      <div className='flex w-[800px] rounded-[20px] bg-white'>
        <div className='w-[500px] px-[45px] pt-10 pb-6'>
          <h4 className='mb-[10px] text-2xl font-medium text-[#242424]'>{t('hello')}</h4>
          <div className='mb-[20px] text-[15px] leading-[20px]'>{t('sign in or create account')}</div>

          <LoginForm loading={loginMutation.isLoading} initialValues={initialLoginFormValue} onSubmit={handleLogin} />

          <div className='mt-[20px] inline-block cursor-pointer text-[13px] leading-[1.15] text-[#0d5cb6]'>
            {t('forgot password')}
          </div>

          <div className='mt-2 flex text-[13px]'>
            <span>{t('no account')}</span>
            <Link to={path.register} className='ml-2 cursor-pointer text-[#0d5cb6]'>
              {t('create account')}
            </Link>
          </div>
        </div>

        <div className='flex w-[300px] items-center justify-center overflow-hidden rounded-r-[20px] bg-gradient-to-r from-[#f0f8ff] to-[#dbeeff]'>
          <Image
            className='w-[230px] rounded object-contain'
            alt='image'
            src='https://salt.tikicdn.com/ts/upload/eb/f3/a3/25b2ccba8f33a5157f161b6a50f64a60.png'
          />
        </div>
      </div>
    </div>
  )
}
