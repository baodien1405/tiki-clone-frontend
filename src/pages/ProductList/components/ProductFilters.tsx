import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { SelectField } from '@/components/FormFields'
import { ProductFiltersPayload } from '@/types'
import Button from '@/components/Button'

export interface ProductFiltersProps {
  initialValues?: Partial<ProductFiltersPayload>
  onSubmit?: (values: ProductFiltersPayload) => void
}

export function ProductFilters({ initialValues, onSubmit }: ProductFiltersProps) {
  const navigate = useNavigate()
  const { control, handleSubmit } = useForm<ProductFiltersPayload>({
    defaultValues: {
      category: '',
      order: '',
      ...initialValues
    }
  })

  const handleLogin = async (values: ProductFiltersPayload) => {
    await onSubmit?.(values)
  }

  return (
    <form className='grid gap-2.5 sm:grid-cols-3 sm:gap-[26px]' onSubmit={handleSubmit(handleLogin)}>
      <SelectField
        name='category'
        control={control}
        placeholder='Select category'
        options={[
          { label: 'Clothes', value: 'clothes' },
          { label: 'Electronics', value: 'electronics' },
          { label: 'Furniture', value: 'furniture' }
        ]}
        onChange={() => handleSubmit(handleLogin)()}
      />

      <SelectField
        name='order'
        control={control}
        placeholder='Select price'
        options={[
          { label: 'Price: Low to High', value: 'asc' },
          { label: 'Price: High to Low', value: 'desc' }
        ]}
        onChange={() => handleSubmit(handleLogin)()}
      />

      <Button
        type='button'
        loading={false}
        disabled={false}
        variant='secondary'
        size='large'
        onClick={() => navigate('/add-edit-product/add')}
      >
        Add Product
      </Button>
    </form>
  )
}
