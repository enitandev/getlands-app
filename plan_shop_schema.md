```prisma
// COMMERCE / RETAIL SHOP MODELS

model Product {
  id              String   @id @default(uuid())
  name            String
  slug            String   @unique
  category        String
  description     String   @db.Text
  sku             String?
  price           Float
  compareAtPrice  Float?
  stockQuantity   Int      @default(0)
  stockStatus     String   @default("in_stock") // in_stock, out_of_stock
  unit            String   @default("kg")
  weight          Float?
  featured        Boolean  @default(false)
  published       Boolean  @default(true)
  coverImage      String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  cartItems       CartItem[]
  orderItems      ShopOrderItem[]
}

model Cart {
  id          String     @id @default(uuid())
  userId      String?    @unique
  status      String     @default("active")
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  items       CartItem[]
  user        User?      @relation(fields: [userId], references: [id])
}

model CartItem {
  id                 String   @id @default(uuid())
  cartId             String
  productId          String
  quantity           Int      @default(1)
  unitPriceSnapshot  Float
  
  cart               Cart     @relation(fields: [cartId], references: [id])
  product            Product  @relation(fields: [productId], references: [id])
}

model ShippingAddress {
  id        String   @id @default(uuid())
  userId    String
  name      String
  phone     String
  address   String   @db.Text
  city      String
  state     String
  notes     String?
  
  user      User     @relation(fields: [userId], references: [id])
  orders    ShopOrder[]
}

model ShopOrder {
  id                 String           @id @default(uuid())
  userId             String
  orderNumber        String           @unique
  status             String           @default("pending") // pending, processing, shipped, delivered, cancelled
  subtotal           Float
  deliveryFee        Float            @default(0)
  total              Float
  paymentStatus      String           @default("unpaid") // unpaid, paid, failed
  shippingAddressId  String
  createdAt          DateTime         @default(now())
  updatedAt          DateTime         @updatedAt
  
  user               User             @relation(fields: [userId], references: [id])
  shippingAddress    ShippingAddress  @relation(fields: [shippingAddressId], references: [id])
  items              ShopOrderItem[]
  deliveries         Delivery[]
}

model ShopOrderItem {
  id                  String     @id @default(uuid())
  orderId             String
  productId           String
  productNameSnapshot String
  unitPrice           Float
  quantity            Int
  total               Float
  
  order               ShopOrder  @relation(fields: [orderId], references: [id])
  product             Product    @relation(fields: [productId], references: [id])
}

model Delivery {
  id           String     @id @default(uuid())
  orderId      String
  status       String     @default("pending")
  courier      String?
  reference    String?
  dispatchedAt DateTime?
  deliveredAt  DateTime?
  
  order        ShopOrder  @relation(fields: [orderId], references: [id])
}
```
