import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Empty, Modal, Spin, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import productApi from '@/api/product.api'
import { useQueryConfig } from '@/hooks'
import { ErrorResponse, FormDataProduct, Product } from '@/types'
import { formatAmount, isAxiosUnprocessableEntityError } from '@/utils'
import { ProductForm } from '../components'
import { Card, Search } from '@/components/Common'
import { EditIcon, TrashIcon } from '@/components/Icons'

interface DataType {
  key?: React.Key
  name?: string
  type?: string
  price?: number
  rating?: number
  quantity?: number
}

export function AdminProductPublished() {
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const [product, setProduct] = useState<Product | undefined>()
  const [productList, setProductList] = useState<Product[]>([])
  const [loadingProduct, setLoadingProduct] = useState(false)
  const queryClient = useQueryClient()
  const queryConfig = useQueryConfig()

  const initialValueEditForm: FormDataProduct = {
    name: product?.product_name || '',
    description: product?.product_description || '',
    image: product?.product_thumb || '',
    price: product?.product_price || 0,
    quantity: product?.product_quantity || 0,
    type: product?.product_type || '',
    brand: product?.product_attributes.brand,
    size: product?.product_attributes.size,
    material: product?.product_attributes.material,
    manufacturer: product?.product_attributes.manufacturer,
    model: product?.product_attributes.model,
    color: product?.product_attributes.color
  }

  const productsQuery = useQuery({
    queryKey: ['published', queryConfig],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 10000)
      return productApi.getPublishedProducts(controller.signal)
    },
    retry: 0
  })

  const unPublishProductMutation = useMutation({
    mutationFn: (id: string) => productApi.unPublishProduct(id)
  })

  const updateProductMutation = useMutation({
    mutationFn: (body: Partial<Product>) => productApi.updateProduct(String(product?._id), body)
  })

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id)
  })

  const deleteManyProductsMutation = useMutation({
    mutationFn: (ids: string[]) => productApi.deleteManyProducts(ids)
  })

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'key',
      width: 200
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => Number(a.name?.length) - Number(b.name?.length)
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => Number(a.price) - Number(b.price),
      render: (value) => formatAmount(value)
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      sorter: (a, b) => Number(a.quantity) - Number(b.quantity)
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      sorter: (a, b) => Number(a.rating) - Number(b.rating)
    },
    {
      title: 'Product Type',
      dataIndex: 'type'
    },
    {
      title: 'Status',
      render: (record) => {
        return (
          <span
            className='cursor-pointer whitespace-normal rounded-full bg-accent px-3 py-1 text-xs text-white'
            onClick={() => handleUnPublishProduct(record)}
          >
            publish
          </span>
        )
      }
    },
    {
      title: 'Action',
      render: (record) => {
        return (
          <div className='flex items-center gap-2'>
            <button onClick={() => handleEditProduct(record)}>
              <EditIcon className='cursor-pointer text-[orange]' width='16px' height='16px' />
            </button>
            <button onClick={() => handleDeleteProduct(record)}>
              <TrashIcon className='cursor-pointer text-[red]' width='16px' height='16px' />
            </button>
          </div>
        )
      }
    }
  ]

  const data: DataType[] = productList.map((product) => {
    return {
      key: product._id,
      name: product.product_name,
      price: product.product_price,
      rating: product.product_ratingsAverage,
      type: product.product_type,
      quantity: product.product_quantity
    }
  })

  const handleUnPublishProduct = async (record: DataType) => {
    unPublishProductMutation.mutate(String(record.key), {
      onSuccess: (data) => {
        toast.success(data.data?.message)
        queryClient.invalidateQueries({ queryKey: ['published', queryConfig], exact: true })
      }
    })
  }

  const handleEditProduct = async (record: DataType) => {
    setIsModalUpdateOpen(true)
    try {
      setLoadingProduct(true)
      const response = await productApi.getProduct(record.key as string)
      setLoadingProduct(false)

      if (response.data.status === 'OK') {
        setProduct(response.data.metadata)
      }
    } catch (error) {
      setLoadingProduct(false)
    }
  }

  const handleDeleteProduct = async (record: DataType) => {
    Modal.confirm({
      title: 'Warning',
      content: 'Are you sure?',
      okButtonProps: { className: 'bg-[#1776ff]' },
      onOk: () => {
        deleteProductMutation.mutate(String(record.key), {
          onSuccess: (data) => {
            toast.success(data.data?.message)
            queryClient.invalidateQueries({ queryKey: ['published', queryConfig], exact: true })
          }
        })
      }
    })
  }

  const handleUpdateProductSubmit = (values: FormDataProduct) => {
    const product = {
      product_name: values.name,
      product_type: values.type,
      product_quantity: Number(values.quantity),
      product_price: Number(values.price),
      product_description: values.description,
      product_thumb: values.image
    }

    if (['Clothing', 'Furniture'].includes(values.type)) {
      Object.assign(product, {
        product_attributes: {
          brand: values.brand,
          size: values.size,
          material: values.material
        }
      })
    }

    if (values.type === 'Electronics') {
      Object.assign(product, {
        product_attributes: {
          manufacturer: values.manufacturer,
          model: values.model,
          color: values.color
        }
      })
    }

    updateProductMutation.mutate(product, {
      onSuccess: async (data) => {
        toast.success(data.data?.message)
        setIsModalUpdateOpen(false)
        queryClient.invalidateQueries({ queryKey: ['published', queryConfig], exact: true })
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<any>>(error)) {
          toast.error(error.response?.data?.message)
        }
      }
    })
  }

  const handleSearch = async ({ searchText }: { searchText: string }) => {
    try {
      if (searchText) {
        const response = await productApi.searchProduct(searchText)
        const products = response.data.metadata

        if (Array.isArray(products)) {
          setProductList(products)
        }
      } else {
        setProductList(productsQuery.data?.data.metadata || [])
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='h-full bg-[#f3f4f6] p-4'>
      <Card className='mb-8 flex flex-col items-center md:flex-row'>
        <div className='mb-4 md:mb-0 md:w-1/4'>
          <h1 className='text-lg font-semibold text-heading'>Published Products</h1>
        </div>

        <div className='ms-auto flex w-full items-center md:w-3/4'>
          <Search onSearch={handleSearch} />
        </div>
      </Card>

      <Table
        className='shadow'
        pagination={{
          pageSize: 5
        }}
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Empty product' />
        }}
        columns={columns}
        dataSource={data}
        loading={
          productsQuery.isFetching ||
          deleteProductMutation.isPending ||
          updateProductMutation.isPending ||
          deleteManyProductsMutation.isPending
        }
      />

      <Modal
        title={<div className='text-center text-[25px]'>Update product</div>}
        width={700}
        centered
        keyboard
        open={isModalUpdateOpen}
        footer={null}
        onCancel={() => setIsModalUpdateOpen(false)}
      >
        <Spin spinning={loadingProduct}>
          <ProductForm
            type='update'
            loading={updateProductMutation.isPending}
            isSuccess={updateProductMutation.isSuccess}
            initialValues={initialValueEditForm}
            onSubmit={handleUpdateProductSubmit}
          />
        </Spin>
      </Modal>
    </div>
  )
}
