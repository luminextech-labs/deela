/**
 * Shopee Affiliate API client
 * Docs: https://affiliate.shopee.com.br/open_api (Brazil)
 * Thailand API: https://open-api.affiliate.shopee.co.th/graphql
 */

const APP_ID = process.env.SHOPEE_AFFILIATE_APP_ID!
const APP_SECRET = process.env.SHOPEE_AFFILIATE_APP_SECRET!
const API_URL = process.env.SHOPEE_AFFILIATE_API_URL || 'https://open-api.affiliate.shopee.com.br/graphql'

function generateSignature(appId: string, timestamp: number, payload: string, secret: string): string {
  const data = appId + timestamp.toString() + payload + secret
  return Buffer.from(data).toString('base64')
}

// In Node.js crypto isn't available directly, so we'll use Web Crypto API via fetch
// For server-side, we use the built-in crypto module
import { createHmac } from 'crypto'

function generateSignatureNode(appId: string, timestamp: number, payload: string, secret: string): string {
  const data = appId + timestamp.toString() + payload + secret
  return createHmac('sha256', secret).update(data).digest('hex')
}

interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{ message: string; extensions?: { code?: number } }>
}

export async function shopeeGraphQL<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<GraphQLResponse<T>> {
  const timestamp = Math.floor(Date.now() / 1000)
  const payload = JSON.stringify({ query, ...(variables ? { variables } : {}) })

  // Use Node.js crypto for server-side
  const signature = generateSignatureNode(APP_ID, timestamp, payload, APP_SECRET)

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `SHA256 Credential=${APP_ID}, Timestamp=${timestamp}, Signature=${signature}`,
    },
    body: payload,
  })

  if (!response.ok) {
    throw new Error(`Shopee API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export interface ProductOffer {
  item_id: string
  item_name: string
  item_url: string
  image_url: string
  price: number
  commission_rate: number
  shop_id: string
  shop_name: string
  discount?: number
  sold_count?: number
}

export interface ShopOffer {
  shop_id: string
  shop_name: string
  shop_url: string
  shop_image: string
  commission_rate: number
  is_mall: boolean
  rating?: number
}

export interface ShortLinkResponse {
  short_link: string
  original_link: string
}

//1.3 Product Offer List
export async function getProductOffers(
  keyword?: string,
  page = 1,
  limit = 20
): Promise<ProductOffer[]> {
  const query = `
    query GetProductOffers($keyword: String, $page: Int, $limit: Int) {
      productOfferV2(keyword: $keyword, page: $page, limit: $limit) {
        list {
          item_id
          item_name
          item_url
          image_url
          price
          commission_rate
          shop_id
          shop_name
          discount
          sold_count
        }
        total
      }
    }
  `
  const result = await shopeeGraphQL<{ productOfferV2: { list: ProductOffer[]; total: number } }>(
    query,
    { keyword, page, limit }
  )
  return result.data?.productOfferV2?.list ?? []
}

// 1.2 Shop Offer List
export async function getShopOffers(
  keyword?: string,
  page = 1,
  limit = 20
): Promise<ShopOffer[]> {
  const query = `
    query GetShopOffers($keyword: String, $page: Int, $limit: Int) {
      shopOfferV2(keyword: $keyword, page: $page, limit: $limit) {
        list {
          shop_id
          shop_name
          shop_url
          shop_image
          commission_rate
          is_mall
          rating
        }
        total
      }
    }
  `
  const result = await shopeeGraphQL<{ shopOfferV2: { list: ShopOffer[]; total: number } }>(
    query,
    { keyword, page, limit }
  )
  return result.data?.shopOfferV2?.list ?? []
}

// 2. Short Link Generator
export async function createShortLink(
  originalUrl: string,
  subIds?: string[]
): Promise<ShortLinkResponse> {
  const query = `
    mutation CreateShortLink($url: String!, $sub_ids: [String]) {
      shortLink(url: $url, sub_ids: $sub_ids) {
        short_link
        original_link
      }
    }
  `
  const result = await shopeeGraphQL<{ shortLink: ShortLinkResponse }>(
    query,
    { url: originalUrl, sub_ids: subIds }
  )
  return result.data!.shortLink
}

// 3.1 Conversion Report
export interface ConversionReport {
  order_id: string
  item_id: string
  item_name: string
  buyer_name: string
  create_time: number
  update_time: number
  status: string
  total_commission: number
  commission_rate: number
  device: string
}

export async function getConversionReport(
  startDate: string,
  endDate: string,
  status?: string,
  limit = 50
): Promise<ConversionReport[]> {
  const query = `
    query GetConversionReport($start_date: String!, $end_date: String!, $status: String, $limit: Int) {
      conversionReport(start_date: $start_date, end_date: $end_date, status: $status, limit: $limit) {
        list {
          order_id
          item_id
          item_name
          buyer_name
          create_time
          update_time
          status
          total_commission
          commission_rate
          device
        }
        total
      }
    }
  `
  const result = await shopeeGraphQL<{ conversionReport: { list: ConversionReport[]; total: number } }>(
    query,
    { start_date: startDate, end_date: endDate, status, limit }
  )
  return result.data?.conversionReport?.list ?? []
}
