/**
 * ShipStation API Type Definitions
 * These replace all the 'any' types in the ShipStation client
 */

export interface ShipStationAddress {
  name?: string
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

export interface ShipStationDimensions {
  length?: number
  width?: number
  height?: number
  units?: 'inches' | 'centimeters'
}

export interface ShipStationWeight {
  value: number
  units: 'pounds' | 'ounces' | 'grams'
}

export interface ShipStationItemOption {
  name: string
  value: string
}

export interface ShipStationOrderItem {
  lineItemKey?: string
  sku?: string
  name: string
  imageUrl?: string
  weight?: ShipStationWeight
  quantity: number
  unitPrice: number
  taxAmount?: number
  shippingAmount?: number
  warehouseLocation?: string
  options?: ShipStationItemOption[]
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
  paymentDate?: string
  shipByDate?: string
  orderStatus: 'awaiting_payment' | 'awaiting_shipment' | 'pending_fulfillment' | 'shipped' | 'on_hold' | 'cancelled'
  customerId?: string
  customerUsername?: string
  customerEmail?: string
  billTo: ShipStationAddress
  shipTo: ShipStationAddress
  items: ShipStationOrderItem[]
  orderTotal: number
  amountPaid?: number
  taxAmount?: number
  shippingAmount?: number
  customerNotes?: string
  internalNotes?: string
  gift?: boolean
  giftMessage?: string
  paymentMethod?: string
  requestedShippingService?: string
  carrierCode?: string
  serviceCode?: string
  packageCode?: string
  confirmation?: 'none' | 'delivery' | 'signature' | 'adult_signature'
  shipDate?: string
  holdUntilDate?: string
  weight?: ShipStationWeight
  dimensions?: ShipStationDimensions
  insuranceOptions?: {
    provider?: string
    insureShipment?: boolean
    insuredValue?: number
  }
  internationalOptions?: {
    contents?: string
    customsItems?: Array<{
      description: string
      quantity: number
      value: number
      harmonizedTariffCode?: string
      originCountry?: string
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
  tagIds?: number[]
  userId?: string
  externallyFulfilled?: boolean
  externallyFulfilledBy?: string
}

export interface ShipStationCarrier {
  name: string
  code: string
  accountNumber?: string
  requiresFundedAccount?: boolean
  balance?: number
  nickname?: string
  shippingProviderId?: number
  primary?: boolean
}

export interface ShipStationService {
  carrierCode: string
  code: string
  name: string
  domestic?: boolean
  international?: boolean
}

export interface ShipStationPackage {
  carrierCode: string
  code: string
  name: string
  dimensions?: {
    length: number
    width: number
    height: number
    units: string
  }
}

export interface ShipStationStore {
  storeId: number
  storeName: string
  marketplaceId?: number
  marketplaceName?: string
  accountName?: string
  email?: string
  integrationUrl?: string
  active?: boolean
  companyName?: string
  phone?: string
  publicEmail?: string
  website?: string
  refreshDate?: string
  lastRefreshAttempt?: string
  createDate?: string
  modifyDate?: string
  autoRefresh?: boolean
}

export interface ShipStationTag {
  tagId: number
  name: string
  color?: string
}

export interface ShipStationWarehouse {
  warehouseId: number
  warehouseName: string
  originAddress?: ShipStationAddress
  returnAddress?: ShipStationAddress
  createDate?: string
  isDefault?: boolean
}

export interface ShipStationShipment {
  shipmentId?: number
  orderId?: number
  orderKey?: string
  userId?: string
  customerEmail?: string
  orderNumber?: string
  createDate?: string
  shipDate?: string
  shipmentCost?: number
  insuranceCost?: number
  trackingNumber?: string
  isReturnLabel?: boolean
  batchNumber?: string
  carrierCode?: string
  serviceCode?: string
  packageCode?: string
  confirmation?: string
  warehouseId?: number
  voided?: boolean
  voidDate?: string
  marketplaceNotified?: boolean
  notifyErrorMessage?: string
  shipTo?: ShipStationAddress
  weight?: ShipStationWeight
  dimensions?: ShipStationDimensions
  insuranceOptions?: {
    provider?: string
    insureShipment?: boolean
    insuredValue?: number
  }
  advancedOptions?: Record<string, unknown>
  shipmentItems?: Array<{
    orderItemId?: number
    lineItemKey?: string
    sku?: string
    name?: string
    imageUrl?: string
    weight?: ShipStationWeight
    quantity?: number
    unitPrice?: number
    warehouseLocation?: string
    options?: ShipStationItemOption[]
    productId?: number
    fulfillmentSku?: string
  }>
  labelData?: string
  formData?: string
}

export interface ShipStationLabel {
  shipmentId: number
  trackingNumber: string
  labelData: string
  formData?: string
  shipmentCost?: number
  insuranceCost?: number
}

export interface ShipStationRate {
  serviceName: string
  serviceCode: string
  shipmentCost: number
  otherCost: number
}

export interface ShipStationListOrdersParams {
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
}

export interface ShipStationListShipmentsParams {
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
}

export interface ShipStationApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  rateLimitRemaining?: number
  rateLimitReset?: Date
}

export interface ShipStationWebhookEvent {
  resource_url: string
  resource_type: 'SHIP_NOTIFY' | 'ITEM_SHIP_NOTIFY' | 'ORDER_NOTIFY' | 'ITEM_ORDER_NOTIFY'
  store_id?: number
  order_number?: string
  tracking_number?: string
  carrier_code?: string
  service_code?: string
}