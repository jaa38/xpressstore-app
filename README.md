# XpressStore Mobile App

XpressStore is a React Native mobile application built with Expo, TypeScript, Supabase, TanStack Query, React Hook Form, and Expo Router.

The platform enables merchants to create storefronts, manage products, receive payments, and process orders from a mobile-first experience.

---

## Current Status

### Completed

#### Foundation

* Expo SDK
* TypeScript
* Expo Router
* Path Aliases
* Theme System
* React Query Setup
* Supabase Integration

#### Authentication & Onboarding

* Splash Screen
* Welcome Screen
* Sign Up Flow
* Password Validation
* Show / Hide Password
* Email Verification Screen
* OTP Input Component
* Multi-Step Onboarding Flow
* Route Constants System

#### Business Setup

* Business Details Screen
* Business Type Dropdown
* Business Category Dropdown
* Dynamic Categories from Supabase
* Form Validation
* Progress Indicators

#### Design System

* AppText Component
* Button Component
* Input Component
* NumberInput Component
* OTPInput Component
* ProgressBar Component
* Dropdown Component
* Theme Tokens
* Typography System
* Spacing System
* Radius System

---

## Project Structure

```txt
src
├── components
│   └── ui
│       ├── AppText
│       ├── Button
│       ├── Input
│       ├── NumberInput
│       ├── OTPInput
│       ├── ProgressBar
│       └── Dropdown
│
├── features
│   ├── auth
│   │   ├── schemas
│   │   ├── services
│   │   └── store
│   │
│   └── business
│       ├── api
│       └── hooks
│
├── navigation
│   └── routes.ts
│
├── providers
│
├── services
│   └── supabase
│
├── storage
│
├── theme
│
└── lib
```

---

## Onboarding Flow

### Step 1

Create Account

* Email Address
* Password
* Confirm Password

### Step 2

Business Details

* Business Name
* Business Address
* Business Type
* Business Category

### Step 3

ID Verification

* Coming Soon

### Step 4

Store Creation

* Coming Soon

---

## Supabase

### Tables

#### business_categories

```sql
create table business_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);
```

### Seed Data

```sql
insert into business_categories (name)
values
('Fashion'),
('Food & Beverage'),
('Electronics'),
('Health & Beauty'),
('Services'),
('Education');
```

### RLS Policy

```sql
create policy "Allow public read"
on public.business_categories
for select
to anon
using (true);
```

---

## Routing Structure

```txt
app
├── index.tsx
│
├── (onboarding)
│   ├── welcome.tsx
│   ├── signup.tsx
│   ├── email-verification.tsx
│   ├── business-details.tsx
│   └── id-verification.tsx
│
├── (auth)
│   ├── login.tsx
│   ├── forgot-password.tsx
│   └── reset-password.tsx
│
└── (tabs)
    ├── home.tsx
    ├── products.tsx
    ├── orders.tsx
    ├── store.tsx
    └── more.tsx
```

---

## Tech Stack

* React Native
* Expo
* TypeScript
* Expo Router
* Supabase
* TanStack Query
* React Hook Form
* Zod
* Zustand
* MMKV

---

## Next Milestones

### Authentication

* Login Screen
* Forgot Password
* Reset Password
* Session Management

### Onboarding

* ID Verification
* Store Setup
* Completion Flow

### Store Management

* Product Creation
* Product Categories
* Product Inventory

### Commerce

* Orders
* Checkout
* Payments

### Merchant Dashboard

* Analytics
* Revenue
* Customer Insights

---

## Author

Jeremiah Akinsowon

Product Designer → Frontend Engineer Journey

Building XpressStore publicly while transitioning into Frontend Engineering.
