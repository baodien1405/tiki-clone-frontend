import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Button, Col, Row } from 'antd'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import Image from '@/components/Image'
import productApi from '@/api/product.api'
import images from '@/assets/images'
import ProductCard from '@/components/ProductCard'
import ProductCardSkeleton from '@/components/ProductCardSkeleton'
import SlickSlider from '@/components/SlickSlider'
import { useQueryConfig } from '@/hooks'
import { AsideFilter } from './components'
import { ProductListConfig } from '@/types'
import { path } from '@/constants'
import { convertTitleCase } from '@/utils'

const imageList = [images.slider1, images.slider2, images.slider3, images.slider4, images.slider5]

const LOAD_MORE_PRODUCT_COUNT = 5

export default function ProductList() {
  const [t] = useTranslation('productList')
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()

  const productsQuery = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 10000)
      return productApi.getProductList(queryConfig as ProductListConfig, controller.signal)
    },
    keepPreviousData: true,
    retry: 0
  })

  const productTypeList = [
    ...new Set(
      productsQuery.data?.data.metadata.items.map((product) => {
        return product.product_type
      })
    )
  ]

  const hideLoadMoreButton =
    productsQuery.data?.data.metadata.items.length === productsQuery.data?.data.metadata.pagination.totalRows

  const outstandingList = [
    { id: '1', imageURL: images.sale33, label: '3.3 Sale Freeship' },
    { id: '2', imageURL: images.goodPrice, label: 'Giá Tốt Mỗi Ngày' },
    { id: '3', imageURL: images.discountVoucher, label: 'Mã giảm giá' },
    { id: '4', imageURL: images.endowAffiliate, label: 'Ưu đãi Affiliate' }
  ]

  const handleLoadMoreProduct = () => {
    navigate({
      pathname: path.product,
      search: createSearchParams({
        _page: String(queryConfig.page),
        _limit: String(Number(queryConfig.limit) + LOAD_MORE_PRODUCT_COUNT)
      }).toString()
    })
  }

  return (
    <div className='bg-[#efefef]'>
      <Helmet>
        <title>Homepage | Tiki Clone</title>
        <meta name='description' content='Homepage Tiki Clone project' />
      </Helmet>
      <div className='mt-1 bg-white'>
        <div className='container'>
          <div className='flex gap-8 overflow-hidden text-ellipsis whitespace-nowrap py-[10px]'>
            {productTypeList.map((type) => (
              <div
                key={type}
                className='cursor-pointer'
                onClick={() =>
                  navigate({
                    pathname: path.productType,
                    search: createSearchParams({
                      type: type.toLowerCase()
                    }).toString()
                  })
                }
              >
                {convertTitleCase(type)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='container'>
        <div className='mt-4 flex'>
          <div className='mr-2 w-[200px] rounded bg-white py-3 px-[8px]'>
            <div className='text-[#27272aư pl-4 text-[14px] font-bold leading-normal'>Nổi bật</div>

            {outstandingList.map((item) => (
              <div key={item.id} className='flex items-center px-4 py-[7px]'>
                <div className='mr-2 h-[34px] w-[34px]'>
                  <Image src={item.imageURL} alt='' className='w-full rounded-lg object-cover' />
                </div>
                <div className='text-[14px] font-normal leading-normal text-[#27272a]'>{item.label}</div>
              </div>
            ))}
          </div>

          <div className='flex w-[calc(100%-208px)] gap-4'>
            <div className=' w-[calc(100%-256px)]'>
              <SlickSlider imageList={imageList} />
            </div>

            <div className='h-[240px] w-[240px]'>
              <Image src={images.subBanner} alt='sub banner' className='w-full rounded-lg object-cover' />
            </div>
          </div>
        </div>

        <div className='flex gap-2 py-8'>
          <AsideFilter />

          <div className='flex-1'>
            <Row gutter={[10, 10]}>
              {productsQuery.isLoading &&
                Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <Col key={index}>
                      <ProductCardSkeleton />
                    </Col>
                  ))}

              {!productsQuery.isLoading &&
                productsQuery.data?.data.metadata.items.map((product) => (
                  <Col key={product._id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
            </Row>

            {!hideLoadMoreButton && (
              <Row>
                <Button
                  type='primary'
                  ghost
                  className='mx-auto mt-3 h-[42px] w-60 border-[1px] border-[#0a68ff] px-3 py-2 text-[16px] leading-normal text-[#0a68ff]'
                  disabled={productsQuery.isFetching}
                  onClick={handleLoadMoreProduct}
                >
                  {productsQuery.isFetching ? t('loading') : t('view more')}
                </Button>
              </Row>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
