# XpressStore Mobile App

XpressStore is a mobile-first commerce platform built with React Native, Expo, TypeScript, Supabase, TanStack Query, React Hook Form, and Expo Router.

The platform enables merchants to:

* Create and manage storefronts
* Add and organize products
* Manage inventory
* Receive orders
* Accept payments
* Grow their business from a mobile application

---

# Current Status

## Foundation ✅

### Project Setup

* Expo SDK 56
* React Native
* TypeScript
* Expo Router
* Path Aliases
* ESLint & Prettier
* Environment Configuration

### Architecture

* Feature-Based Folder Structure
* Route Constants System
* Supabase Integration
* TanStack Query Setup
* Zustand State Management
* MMKV Storage
* Reusable Design System

---

# Authentication & Onboarding ✅

### Authentication

* Welcome Screen
* Sign Up Screen
* Login Screen
* Forgot Password
* Password Reset Flow
* Email Verification
* OTP Verification
* Password Validation
* Show / Hide Password

### Onboarding

#### Step 1

Business Account Creation

#### Step 2

Business Details

* Business Name
* Business Address
* Business Type
* Business Category

#### Step 3

ID Verification

#### Step 4

Biometric Verification

* Progress Indicators
* Multi-Step Navigation
* Validation
* Supabase Integration

---

# Merchant Dashboard 🚧

### Bottom Navigation

* Home
* Products
* Orders
* Store
* More

### Home

* Dashboard Layout
* Quick Actions
* Merchant Overview

---

# Product Management 🚧

### Product List

* Product Grid
* Product Cards
* Product Visibility Toggle
* Product Details Navigation
* Product Search Foundation

### Product Details

* Dynamic Product Route
* Product Information Screen

### Product Creation Wizard

#### Step 1 — Product Information

* Product Image Upload
* Camera Integration
* Gallery Upload
* Product Name
* Product Description
* Character Counter
* Category Selection
* Custom Category Creation

#### Step 2 — Pricing & Inventory

* Selling Price
* Cost Price
* Inventory Setup
* SKU Generation

#### Step 3 — Product Variants

* Size Variants
* Color Variants
* Product Options

#### Step 4 — Storefront Settings

* Product Visibility
* Featured Product Settings

#### Step 5 — Review & Publish

* Product Summary
* Publish Product

---

# Design System ✅

## Typography

* Headings
* Body Text
* Labels
* Captions
* Buttons

## Components

### Core Components

* AppText
* Button
* Input
* Dropdown
* NumberInput
* OTPInput
* ProgressBar
* Divider
* Card

### Product Components

* ImageActionCard
* Product Cards
* Product Visibility Controls

### Feedback States

* Default
* Focus
* Disabled
* Error
* Success

### Theme Tokens

* Colors
* Typography
* Radius
* Spacing
* Shadows
* Semantic Theme System

---

# Supabase

## Current Integration

### Authentication

* User Registration
* Email Verification
* Login
* Password Recovery

### Database

#### business_categories

```sql
create table business_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);
```

### Row Level Security

```sql
create policy "Allow public read"
on public.business_categories
for select
to anon
using (true);
```

---

# Project Structure

```txt
app
├── (auth)
├── (onboarding)
├── (password-recovery)
├── (tabs)
│
├── product
│   ├── [id].tsx
│   └── add
│       ├── InfoScreen.tsx
│       ├── PricingScreen.tsx
│       ├── VariantsScreen.tsx
│       ├── StorefrontScreen.tsx
│       └── ReviewScreen.tsx
│
└── _layout.tsx

src
├── components
│   ├── ui
│   └── product
│
├── features
│   ├── auth
│   ├── business
│   ├── products
│   └── storefront
│
├── navigation
├── providers
├── services
├── storage
├── theme
└── lib
```

---

# Tech Stack

## Frontend

* React Native
* Expo
* TypeScript
* Expo Router

## State Management

* Zustand
* TanStack Query

## Forms & Validation

* React Hook Form
* Zod

## Backend

* Supabase

## Storage

* MMKV

---

# Roadmap

## Phase 1 — Foundation ✅

* Authentication
* Onboarding
* Design System
* Navigation
* Supabase Integration

## Phase 2 — Product Management 🚧

* Product Creation
* Product Editing
* Product Categories
* Product Variants
* Inventory Management

## Phase 3 — Storefront

* Store Configuration
* Public Storefront
* Product Publishing

## Phase 4 — Commerce

* Orders
* Checkout
* Payments
* Shipping

## Phase 5 — Analytics

* Revenue Dashboard
* Product Insights
* Customer Analytics
* Business Reporting

---

# Author

Jeremiah Akinsowon

Product Designer → Frontend Engineer

Building XpressStore publicly while transitioning into Frontend Engineering and React Native development.

