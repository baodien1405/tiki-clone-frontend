import { InputField, InputPasswordField } from '@/components/FormFields'
import Image from '@/components/Image'
import { path } from '@/constants'
import { Button, Form } from 'antd'
import { Link } from 'react-router-dom'

export interface FormData {
  email: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const handleRegister = (values: FormData) => {
    console.log(values)
  }

  return (
    <div className='flex h-screen items-center justify-center bg-[#efefef]'>
      <div className='flex w-[800px] rounded-[20px] bg-white'>
        <div className='w-[500px] px-[45px] pt-10 pb-6'>
          <h4 className='mb-[10px] text-2xl font-medium text-[#242424]'>Tạo tài khoản</h4>
          <div className='mb-[20px] text-[15px] leading-[20px]'>Vui lòng nhập thông tin để đăng ký</div>

          <Form onFinish={handleRegister}>
            <InputField name='email' placeholder='abc@email.com' classNameInput='py-2' message='Vui lòng nhập email' />
            <InputPasswordField
              name='password'
              type='password'
              placeholder='Mật khẩu'
              classNameInput='py-2'
              message='Vui lòng nhập password'
            />
            <InputPasswordField
              name='confirmPassword'
              type='password'
              placeholder='Nhập lại mật khẩu'
              classNameInput='py-2'
              message='Vui lòng nhập password'
            />

            <Button
              type='primary'
              danger
              className='mx-auto mt-[16px] h-[48px] w-full border-[1px] px-3 py-2 text-[20px] font-medium leading-6'
              htmlType='submit'
            >
              Đăng ký
            </Button>
          </Form>

          <div className='mt-[20px] flex text-[13px]'>
            <span>Bạn đã có tài khoản?</span>
            <Link to={path.login} className='ml-2 cursor-pointer text-[#0d5cb6]'>
              Đăng nhập
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
