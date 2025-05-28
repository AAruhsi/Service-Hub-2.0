authentication api

POST /api/auth/signup/user → Customer signup ✅
POST /api/auth/signup/provider →Provider signup ✅

POST /api/auth/login → Login Customer and return JWT token(customer,provider) ✅
POST /api/auth/logout → Logout Customer and set JWT token(customer,provider) null✅

GET /api/auth/profile → Get logged-in user profile (Customer,Provider) ✅
PUT /api/auth/profile/update → Update user profile

➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

admin api

POST /api/admin/signnup → admin signup ✅
POST /api/admin/login → Login admin✅

GET /api/admin/users → List all users✅
GET /api/admin/providers → List all users✅

GET /api/admin/bookings → View all bookings
DELETE /api/admin/user/:id → Ban or delete user

➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

service provider api

GET /api/providers/ → List all verified service providers
GET /api/providers/:id → Get specific provider details
PUT /api/providers/:id/update → Update provider profile/skills

➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

categories api

<<<<<<< HEAD
POST /api/category → (Admin) Create service categories✅
POST /api/subcategory → (Admin) Create service subcategories✅
POST /api/service → (Admin) Create services✅

GET /api/category → List all services (e.g., Cleaning, AC repair)✅
GET /api/subcategory → List all services (e.g., Cleaning, AC repair)✅
GET /api/service → List all services (e.g., Cleaning, AC repair)✅

POST /api/toggle-category → (Admin) toggle the isActive to true/false & cascade that for all services and subcategory✅
POST /api/toggle-subcategory → (Admin) toggle the isActive to true/false & cascade that for all services ✅

PATCH /api/category → (Admin) update the name and image✅
PATCH /api/subcategory → (Admin) update the name ✅
PATCH /api/service → (Admin) update the details of services✅

GET /api/services/:id → Get details of a specific service
POST /api/services/ → (Admin) Create a new service

DELETE /api/services/:id → (Admin) Delete a service

➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

review rating api

POST /api/reviews/ → Add review for a service/provider
GET /api/reviews/service/:id → Get reviews for a service
GET /api/reviews/provider/:id → Get reviews for a provider

➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

payment api

POST /api/payments/create → Create payment session
POST /api/payments/webhook → Payment success/failure callback
GET /api/payments/user → Get payment history for customer

➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

bookings api

POST /api/bookings/ → Book a service
GET /api/bookings/user → Get bookings for a logged-in customer
GET /api/bookings/provider → Get bookings for a service provider
PUT /api/bookings/:id/cancel → Cancel a booking
PUT /api/bookings/:id/status → Update booking status (accepted, completed)

➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
