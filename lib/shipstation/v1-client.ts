/**
 * ShipStation API V1 Client
 * For order management and fulfillment integration
 * 
 * Based on ShipStation API v1 documentation:
 * - Base URL: https://ssapi.shipstation.com/
 * - Authentication: Basic Auth (API Key + Secret)
 * - Rate Limit: 40 requests per minute
 * - Timezone: PST/PDT for datetime values
 */

import type {
  ShipStationOrder,
  ShipStationApiResponse,
  ShipStationCarrier,
  ShipStationService,
  ShipStationStore,
  ShipStationTag,
  ShipStationWarehouse,
  ShipStationShipment,
  ShipStationLabel,
  ShipStationPackage,
  ShipStationAddress,
  ShipStationOrderItem,
} from '@/lib/types/shipstation'

export interface ShipStationCredentials {
  apiKey: string
  apiSecret: string
}

export interface ShipStationAddress {
  name: string
  company?: string
  street1: string
  street2?: string
  street3?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  residential?: boolean
}

export interface ShipStationOrderItem {
  lineItemKey?: string
  sku?: string
  name: string
  imageUrl?: string
  weight?: {
    value: number
    units: 'pounds' | 'ounces' | 'grams' | 'kilograms'
  }
  quantity: number
  unitPrice: number
  taxAmount?: number
  shippingAmount?: number
  warehouseLocation?: string
  options?: Array<{
    name: string
    value: string
  }>
  productId?: number
  fulfillmentSku?: string
  adjustment?: boolean
  upc?: string
  createDate?: string
  modifyDate?: string
}

export interface ShipStationOrder {
  orderNumber: string
  orderKey?: string
  orderDate: string
  createDate?: string
  modifyDate?: string
  paymentDate?: string
  shipByDate?: string
  orderStatus: 'awaiting_payment' | 'awaiting_shipment' | 'shipped' | 'on_hold' | 'cancelled'
  customerId?: number
  customerUsername?: string
  customerEmail?: string
  billTo: ShipStationAddress
  shipTo: ShipStationAddress
  items: ShipStationOrderItem[]
  orderTotal: number
  amountPaid: number
  taxAmount: number
  shippingAmount: number
  customerNotes?: string
  internalNotes?: string
  gift?: boolean
  giftMessage?: string
  paymentMethod?: string
  requestedShippingService?: string
  carrierCode?: string
  serviceCode?: string
  packageCode?: string
  confirmation?: string
  shipDate?: string
  holdUntilDate?: string
  weight?: {
    value: number
    units: 'pounds' | 'ounces' | 'grams' | 'kilograms'
  }
  dimensions?: {
    length: number
    width: number
    height: number
    units: 'inches' | 'centimeters'
  }
  insuranceOptions?: {
    provider: string
    insureShipment: boolean
    insuredValue: number
  }
  internationalOptions?: {
    contents?: string
    customsItems?: Array<{
      description: string
      quantity: number
      value: number
      harmonizedTariffCode?: string
      countryOfOrigin?: string
    }>
    nonDelivery?: string
  }
  advancedOptions?: {
    warehouseId?: number
    nonMachinable?: boolean
    saturdayDelivery?: boolean
    containsAlcohol?: boolean
    mergedOrSplit?: boolean
    mergedIds?: number[]
    parentId?: number
    storeId?: number
    customField1?: string
    customField2?: string
    customField3?: string
    source?: string
    billToParty?: string
    billToAccount?: string
    billToPostalCode?: string
    billToCountryCode?: string
  }
}

export interface ShipStationApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  rateLimitRemaining?: number
  rateLimitReset?: number
}

export class ShipStationV1Client {
  private readonly baseUrl = 'https://ssapi.shipstation.com'
  private readonly credentials: ShipStationCredentials
  private rateLimitRemaining = 40
  private rateLimitResetTime = 0

  constructor(credentials: ShipStationCredentials) {
    this.credentials = credentials
  }

  private getAuthHeader(): string {
    const auth = Buffer.from(
      `${this.credentials.apiKey}:${this.credentials.apiSecret}`
    ).toString('base64')
    return `Basic ${auth}`
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: Record<string, unknown>
  ): Promise<ShipStationApiResponse<T>> {
    // Check rate limiting
    if (this.rateLimitRemaining <= 0 && Date.now() < this.rateLimitResetTime) {
      const waitTime = this.rateLimitResetTime - Date.now()
      throw new Error(`Rate limit exceeded. Retry after ${waitTime}ms`)
    }

    const url = `${this.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      'Authorization': this.getAuthHeader(),
      'Content-Type': 'application/json',
      'User-Agent': 'Toynami-NextJS/1.0'
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
      })

      // Update rate limiting info from response headers
      const rateLimitRemaining = response.headers.get('X-Rate-Limit-Remaining')
      const rateLimitReset = response.headers.get('X-Rate-Limit-Reset')
      
      if (rateLimitRemaining) {
        this.rateLimitRemaining = parseInt(rateLimitRemaining, 10)
      }
      
      if (rateLimitReset) {
        this.rateLimitResetTime = parseInt(rateLimitReset, 10) * 1000 // Convert to milliseconds
      }

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.Message || errorData.message || errorMessage
        } catch {
          // Use the raw error text if it's not JSON
          if (errorText) errorMessage = errorText
        }

        return {
          success: false,
          error: errorMessage,
          rateLimitRemaining: this.rateLimitRemaining,
          rateLimitReset: this.rateLimitResetTime
        }
      }

      const data = await response.json()
      return {
        success: true,
        data,
        rateLimitRemaining: this.rateLimitRemaining,
        rateLimitReset: this.rateLimitResetTime
      }
    } catch (error) {
        console.error('Error in catch block:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        rateLimitRemaining: this.rateLimitRemaining,
        rateLimitReset: this.rateLimitResetTime
      }
    }
  }

  /**
   * Create or update an order in ShipStation
   */
  async createOrder(order: ShipStationOrder): Promise<ShipStationApiResponse<ShipStationOrder>> {
    // ENFORCE only allowed store
    const allowedStoreId = process.env.SHIPSTATION_STORE_ID
    const blockedStores = process.env.SHIPSTATION_BLOCKED_STORES?.split(',').map(id => id.trim()) || []
    const orderStoreId = order.advancedOptions?.storeId?.toString()
    
    // Check if order is trying to use a blocked store
    if (orderStoreId && blockedStores.includes(orderStoreId)) {
      return {
        success: false,
        error: `Store ID ${orderStoreId} is BLOCKED. Orders must use store ${allowedStoreId}`,
        data: null,
        rateLimitRemaining: 40
      }
    }
    
    // ENFORCE the correct store ID
    if (orderStoreId && orderStoreId !== allowedStoreId) {
      return {
        success: false,
        error: `Invalid store ID ${orderStoreId}. Orders MUST use store ${allowedStoreId}`,
        data: null,
        rateLimitRemaining: 40
      }
    }
    
    // Force the correct store ID
    if (!order.advancedOptions) {
      order.advancedOptions = {}
    }
    order.advancedOptions.storeId = parseInt(allowedStoreId!)
    
    console.log(`Creating order in ShipStation store ${allowedStoreId}`)
    
    return this.makeRequest('/orders/createorder', 'POST', order)
  }

  /**
   * Get an order by order number
   */
  async getOrder(orderNumber: string): Promise<ShipStationApiResponse<{orders: ShipStationOrder[], total: number, page: number, pages: number}>> {
    return this.makeRequest(`/orders?orderNumber=${encodeURIComponent(orderNumber)}`)
  }

  /**
   * Get orders with filters
   */
  async getOrders(params?: {
    customerName?: string
    itemKeyword?: string
    createDateStart?: string
    createDateEnd?: string
    modifyDateStart?: string
    modifyDateEnd?: string
    orderDateStart?: string
    orderDateEnd?: string
    orderNumber?: string
    orderStatus?: string
    paymentDateStart?: string
    paymentDateEnd?: string
    storeId?: number
    sortBy?: string
    sortDir?: 'ASC' | 'DESC'
    page?: number
    pageSize?: number
  }): Promise<ShipStationApiResponse<{orders: ShipStationOrder[], total: number, page: number, pages: number}>> {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const endpoint = `/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.makeRequest(endpoint)
  }

  /**
   * Mark an order as shipped
   */
  async markOrderShipped(orderId: number, shipDate: string, carrier: string, service: string, trackingNumber: string, notifyCustomer = true, notifySalesChannel = true): Promise<ShipStationApiResponse<ShipStationShipment>> {
    const shipmentData = {
      orderId,
      carrierCode: carrier,
      shipDate,
      trackingNumber,
      notifyCustomer,
      notifySalesChannel
    }

    return this.makeRequest('/orders/markasshipped', 'POST', shipmentData)
  }

  /**
   * Get list of carriers configured in ShipStation
   */
  async getCarriers(): Promise<ShipStationApiResponse<ShipStationCarrier[]>> {
    return this.makeRequest('/carriers')
  }

  /**
   * Get list of stores configured in ShipStation
   */
  async listStores(): Promise<ShipStationApiResponse<ShipStationStore[]>> {
    return this.makeRequest('/stores')
  }

  /**
   * Get list of services for a specific carrier
   */
  async getCarrierServices(carrierCode: string): Promise<ShipStationApiResponse<ShipStationService[]>> {
    return this.makeRequest(`/carriers/listservices?carrierCode=${encodeURIComponent(carrierCode)}`)
  }

  /**
   * Test the API connection
   */
  async testConnection(): Promise<ShipStationApiResponse<{connection: boolean, message?: string}>> {
    return this.makeRequest('/carriers')
  }

  /**
   * Update an existing order
   */
  async updateOrder(orderId: string, updates: Partial<ShipStationOrder>): Promise<ShipStationApiResponse<ShipStationOrder>> {
    const existingOrder = await this.getOrderById(orderId)
    if (!existingOrder.success || !existingOrder.data) {
      return existingOrder
    }
    
    const updatedOrder = {
      ...existingOrder.data,
      ...updates,
      orderId: orderId
    }
    
    return this.makeRequest('/orders/createorder', 'POST', updatedOrder)
  }

  /**
   * Get an order by ID
   */
  async getOrderById(orderId: string): Promise<ShipStationApiResponse<ShipStationOrder>> {
    return this.makeRequest(`/orders/${orderId}`)
  }

  /**
   * Delete an order
   */
  async deleteOrder(orderId: string): Promise<ShipStationApiResponse<{success: boolean, message?: string}>> {
    return this.makeRequest(`/orders/${orderId}`, 'DELETE')
  }

  /**
   * Add a tag to an order
   */
  async addOrderTag(orderId: string, tagId: number): Promise<ShipStationApiResponse<{success: boolean, message?: string}>> {
    return this.makeRequest('/orders/addtag', 'POST', {
      orderId,
      tagId
    })
  }

  /**
   * Remove a tag from an order
   */
  async removeOrderTag(orderId: string, tagId: number): Promise<ShipStationApiResponse<{success: boolean, message?: string}>> {
    return this.makeRequest('/orders/removetag', 'POST', {
      orderId,
      tagId
    })
  }

  /**
   * Hold an order until a specific date
   */
  async holdOrder(orderId: string, holdUntilDate: string): Promise<ShipStationApiResponse<{success: boolean, message?: string}>> {
    return this.makeRequest('/orders/holduntil', 'POST', {
      orderId,
      holdUntilDate
    })
  }

  /**
   * Remove hold from an order
   */
  async unholdOrder(orderId: string): Promise<ShipStationApiResponse<{success: boolean, message?: string}>> {
    return this.makeRequest('/orders/restorefromhold', 'POST', {
      orderId
    })
  }

  /**
   * Assign order to a different warehouse
   */
  async assignToWarehouse(orderId: string, warehouseId: number): Promise<ShipStationApiResponse<{success: boolean, message?: string}>> {
    return this.makeRequest('/orders/assignuser', 'POST', {
      orderId,
      warehouseId
    })
  }

  /**
   * Create a shipping label for an order
   */
  async createLabel(params: {
    orderId?: string
    carrierCode: string
    serviceCode: string
    packageCode: string
    confirmation?: string
    shipDate?: string
    weight: {
      value: number
      units: 'pounds' | 'ounces' | 'grams' | 'kilograms'
    }
    dimensions?: {
      length: number
      width: number
      height: number
      units: 'inches' | 'centimeters'
    }
    shipFrom?: ShipStationAddress
    shipTo: ShipStationAddress
    insuranceOptions?: {
      provider: string
      insureShipment: boolean
      insuredValue: number
    }
    internationalOptions?: {
      contents: string
      customsItems: Array<{
        description: string
        quantity: number
        value: number
        harmonizedTariffCode: string
        originCountry: string
      }>
    }
    advancedOptions?: {
      warehouseId?: number
      nonMachinable?: boolean
      saturdayDelivery?: boolean
      containsAlcohol?: boolean
      customField1?: string
      customField2?: string
      customField3?: string
    }
    testLabel?: boolean
  }): Promise<ShipStationApiResponse<ShipStationLabel>> {
    return this.makeRequest('/orders/createlabelfororder', 'POST', params)
  }

  /**
   * Void a shipping label
   */
  async voidLabel(shipmentId: string): Promise<ShipStationApiResponse<{success: boolean, message?: string}>> {
    return this.makeRequest('/shipments/voidlabel', 'POST', {
      shipmentId
    })
  }

  /**
   * Get shipping rates for an order
   */
  async getShippingRates(params: {
    carrierCode: string
    fromPostalCode: string
    toState?: string
    toCountry?: string
    toPostalCode: string
    toCity?: string
    weight: {
      value: number
      units: 'pounds' | 'ounces' | 'grams' | 'kilograms'
    }
    dimensions?: {
      length: number
      width: number
      height: number
      units: 'inches' | 'centimeters'
    }
    confirmation?: string
    residential?: boolean
  }): Promise<ShipStationApiResponse<ShipStationRate[]>> {
    return this.makeRequest('/shipments/getrates', 'POST', params)
  }

  /**
   * List shipments with filters
   */
  async listShipments(params?: {
    recipientName?: string
    recipientCountryCode?: string
    orderNumber?: string
    orderId?: string
    carrierCode?: string
    serviceCode?: string
    trackingNumber?: string
    createDateStart?: string
    createDateEnd?: string
    shipDateStart?: string
    shipDateEnd?: string
    voidDateStart?: string
    voidDateEnd?: string
    includeShipmentItems?: boolean
    sortBy?: string
    sortDir?: 'ASC' | 'DESC'
    page?: number
    pageSize?: number
  }): Promise<ShipStationApiResponse<{shipments: ShipStationShipment[], total: number, page: number, pages: number}>> {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const endpoint = `/shipments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.makeRequest(endpoint)
  }

  /**
   * Get a specific shipment
   */
  async getShipment(shipmentId: string): Promise<ShipStationApiResponse<ShipStationShipment>> {
    return this.makeRequest(`/shipments/${shipmentId}`)
  }

  /**
   * List available tags
   */
  async listTags(): Promise<ShipStationApiResponse<ShipStationTag[]>> {
    return this.makeRequest('/accounts/listtags')
  }

  /**
   * List warehouses
   */
  async listWarehouses(): Promise<ShipStationApiResponse<ShipStationWarehouse[]>> {
    return this.makeRequest('/warehouses')
  }

  /**
   * Get a specific warehouse
   */
  async getWarehouse(warehouseId: string): Promise<ShipStationApiResponse<ShipStationWarehouse>> {
    return this.makeRequest(`/warehouses/${warehouseId}`)
  }

  /**
   * Create a return label
   */
  async createReturnLabel(params: {
    carrierCode: string
    serviceCode: string
    packageCode: string
    confirmation?: string
    shipDate?: string
    weight: {
      value: number
      units: 'pounds' | 'ounces' | 'grams' | 'kilograms'
    }
    dimensions?: {
      length: number
      width: number
      height: number
      units: 'inches' | 'centimeters'
    }
    shipFrom: ShipStationAddress
    shipTo: ShipStationAddress
    insuranceOptions?: {
      provider: string
      insureShipment: boolean
      insuredValue: number
    }
    testLabel?: boolean
  }): Promise<ShipStationApiResponse<ShipStationLabel>> {
    return this.makeRequest('/shipments/createlabel', 'POST', params)
  }

  /**
   * Get carrier packages
   */
  async getCarrierPackages(carrierCode: string): Promise<ShipStationApiResponse<ShipStationPackage[]>> {
    return this.makeRequest(`/carriers/listpackages?carrierCode=${carrierCode}`)
  }

  /**
   * List orders by tag
   */
  async listOrdersByTag(params: {
    tagId: number
    orderStatus?: string
    page?: number
    pageSize?: number
  }): Promise<ShipStationApiResponse<{orders: ShipStationOrder[], total: number, page: number, pages: number}>> {
    const queryParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString())
      }
    })
    
    return this.makeRequest(`/orders/listbytag?${queryParams.toString()}`)
  }

  /**
   * Create or update multiple orders at once
   */
  async createMultipleOrders(orders: ShipStationOrder[]): Promise<ShipStationApiResponse<{results: ShipStationOrder[], hasErrors: boolean, message?: string}>> {
    return this.makeRequest('/orders/createorders', 'POST', orders)
  }

  /**
   * Convert our internal order format to ShipStation format
   */
  static formatOrder(orderData: {
    orderId: number
    orderNumber: string
    orderDate: string
    orderStatus?: string
    customerEmail?: string
    customerName?: string
    billTo?: ShipStationAddress
    shipTo?: ShipStationAddress
    items?: ShipStationOrderItem[]
    orderTotal: number
    amountPaid: number
    shippingAmount: number
    taxAmount: number
    paymentMethod?: string
    internalNotes?: string
    customerNotes?: string
    shippingMethod?: { carrier?: string; service?: string; serviceCode?: string }
  }): ShipStationOrder {
    // Convert addresses to ShipStation format
    const formatAddress = (address: ShipStationAddress | Record<string, unknown>, name?: string): ShipStationAddress => {
      if (!address) {
        throw new Error('Address is required')
      }

      const addr = address as Record<string, unknown>

      return {
        name: (addr.name as string) || name || 'Unknown',
        company: (addr.company as string) || '',
        street1: (addr.address as string) || (addr.address_line_1 as string) || (addr.street1 as string) || '',
        street2: (addr.address2 as string) || (addr.address_line_2 as string) || (addr.street2 as string) || '',
        city: (addr.city as string) || (addr.city_locality as string) || (addr.admin_area_2 as string) || '',
        state: (addr.state as string) || (addr.state_province as string) || (addr.admin_area_1 as string) || '',
        postalCode: (addr.zipCode as string) || (addr.postal_code as string) || (addr.postalCode as string) || '',
        country: (addr.country as string) || (addr.country_code as string) || 'US',
        phone: (addr.phone as string) || '',
        residential: (addr.residential as boolean) !== false // Default to residential unless explicitly set
      }
    }

    // Format order items
    const formatItems = (items: ShipStationOrderItem[] = []): ShipStationOrderItem[] => {
      return items.map((item, index) => {
        const itemData = item as Record<string, unknown>
        return {
          lineItemKey: `item_${index}`,
          sku: item.sku || (itemData.productId as number)?.toString() || '',
          name: (itemData.productName as string) || item.name || 'Unknown Product',
          quantity: item.quantity || 1,
          unitPrice: ((itemData.price as number) || 0) / 100, // Convert cents to dollars
          taxAmount: (item.taxAmount || 0) / 100,
          weight: (itemData.weight as number) ? {
            value: itemData.weight as number,
            units: 'pounds' as const
          } : undefined,
          productId: itemData.productId as number,
          options: item.options || []
        }
      })
    }

    // Convert PST/PDT timezone (ShipStation requirement)
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString)
      // Convert to PST/PDT (UTC-8/-7)
      return date.toISOString().replace('T', ' ').replace('Z', '')
    }

    // Get store ID from environment
    const storeId = process.env.SHIPSTATION_STORE_ID ? parseInt(process.env.SHIPSTATION_STORE_ID) : undefined

    return {
      orderNumber: orderData.orderNumber,
      orderKey: `toynami_${orderData.orderId}`,
      orderDate: formatDate(orderData.orderDate),
      orderStatus: (orderData.orderStatus as 'awaiting_payment' | 'awaiting_shipment' | 'shipped' | 'on_hold' | 'cancelled') || 'awaiting_shipment',
      customerEmail: orderData.customerEmail || '',
      billTo: formatAddress(orderData.billTo || {} as ShipStationAddress, orderData.customerName),
      shipTo: formatAddress(orderData.shipTo || {} as ShipStationAddress, orderData.customerName),
      items: formatItems(orderData.items),
      orderTotal: orderData.orderTotal / 100, // Convert cents to dollars
      amountPaid: orderData.amountPaid / 100,
      taxAmount: orderData.taxAmount / 100,
      shippingAmount: orderData.shippingAmount / 100,
      paymentMethod: orderData.paymentMethod || 'PayPal',
      internalNotes: orderData.internalNotes || '',
      customerNotes: orderData.customerNotes || '',
      advancedOptions: {
        storeId: storeId, // Specify which store to create the order in
        customField1: 'Toynami PayPal Shop', // Custom identifier
        customField2: orderData.orderNumber, // Our order number
      },
      requestedShippingService: orderData.shippingMethod?.service || (orderData.shippingMethod as Record<string, unknown>)?.serviceName as string,
      carrierCode: this.mapCarrierCode(orderData.shippingMethod?.carrier),
      serviceCode: orderData.shippingMethod?.serviceCode
    }
  }

  /**
   * Map carrier names to ShipStation carrier codes
   */
  private static mapCarrierCode(carrier?: string): string | undefined {
    if (!carrier) return undefined
    
    const carrierMap: Record<string, string> = {
      'ups': 'ups',
      'fedex': 'fedex', 
      'usps': 'usps',
      'dhl': 'dhl_express',
      'ontrac': 'ontrac',
      'lasership': 'lasership'
    }
    
    return carrierMap[carrier.toLowerCase()] || carrier.toLowerCase()
  }
}

// Create and export a singleton instance
let shipStationV1Client: ShipStationV1Client | null = null

export function getShipStationV1Client(): ShipStationV1Client {
  if (!shipStationV1Client) {
    const apiKey = process.env.SHIPSTATION_API_KEY_V1
    const apiSecret = process.env.SHIPSTATION_API_SECRET_V1
    
    if (!apiKey || !apiSecret) {
      throw new Error('ShipStation V1 API credentials not configured. Please set SHIPSTATION_API_KEY_V1 and SHIPSTATION_API_SECRET_V1 environment variables.')
    }
    
    shipStationV1Client = new ShipStationV1Client({
      apiKey,
      apiSecret
    })
  }
  
  return shipStationV1Client
}