import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button, Form } from 'antd'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { InputField, SelectedField, UploadField } from '@/components/FormFields'
import { useProductFormSchema } from '@/hooks'
import { FormDataProduct } from '@/types'
import productApi from '@/api/product.api'
import { convertTitleCase } from '@/utils'

export interface ProductFormProps {
  type?: 'add' | 'update'
  loading?: boolean
  isSuccess?: boolean
  initialValues?: FormDataProduct
  onSubmit?: (formValues: FormDataProduct) => void
}

export function ProductForm({ type = 'add', loading, isSuccess, initialValues, onSubmit }: ProductFormProps) {
  const [form] = Form.useForm()
  const [productURL, setProductURL] = useState('')
  const [showUploadList, setShowUploadList] = useState(true)
  const schema = useProductFormSchema()

  const productTypesQuery = useQuery({
    queryKey: ['types'],
    queryFn: () => productApi.getProductTypeList(),
    retry: 0
  })

  const productTypeOptions = productTypesQuery.data?.data.data.map((type) => ({
    label: convertTitleCase(type),
    value: type
  }))

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isValid }
  } = useForm<FormDataProduct>({
    mode: 'onChange',
    defaultValues: initialValues,
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (initialValues) {
      setProductURL(initialValues.image)
      Object.entries(initialValues).map(([key, val]) =>
        setValue(key as keyof FormDataProduct, String(val), {
          shouldValidate: true
        })
      )
      form.setFieldsValue(initialValues)
    }
  }, [initialValues, form, setValue])

  useEffect(() => {
    if (isSuccess) {
      setProductURL('')
      setShowUploadList(false)
      reset()
      form.resetFields()
    }
  }, [isSuccess, form, reset])

  const handleProductUpload = (imageURL: string) => {
    setProductURL(imageURL)
  }

  const handleProductSubmit = async (values: FormDataProduct) => {
    await onSubmit?.({ ...values, image: productURL })
  }

  return (
    <Form form={form} colon={false} initialValues={initialValues} onFinish={handleSubmit(handleProductSubmit)}>
      <InputField label='Name' name='name' control={control} placeholder='Th??m t??n' classNameInput='py-2' />

      {Array.isArray(productTypeOptions) && productTypeOptions.length > 0 && (
        <SelectedField
          label='Type'
          name='type'
          control={control}
          placeholder='-- Choose types --'
          options={productTypeOptions}
        />
      )}

      <InputField
        control={control}
        label='CountInStock'
        name='countInStock'
        placeholder=''
        classNameInput='py-2 w-[100px]'
      />

      <InputField label='Price' name='price' control={control} placeholder='' classNameInput='py-2 w-[100px]' />

      <InputField label='Description' name='description' control={control} placeholder='' classNameInput='py-2' />

      <InputField label='Rating' name='rating' control={control} placeholder='' classNameInput='py-2 w-[50px]' />

      <UploadField
        label='Image'
        name='image'
        className='inline-block w-[200px]'
        accept='image/*'
        listType='picture'
        maxCount={1}
        showUploadList={showUploadList}
        onChange={handleProductUpload}
      />

      <Button
        loading={loading}
        disabled={loading || !isValid}
        type='primary'
        htmlType='submit'
        className='mx-auto block h-10 w-[176px] rounded bg-[#0b74e5]'
      >
        {type === 'add' ? 'Add' : 'Update'}
      </Button>
    </Form>
  )
}
