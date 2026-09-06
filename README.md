# XpressStore Mobile App

XpressStore is a mobile-first commerce platform designed to help merchants manage their businesses from a single mobile application.

Built with **React Native, Expo, TypeScript, Supabase, TanStack Query, Zustand, React Hook Form, and Expo Router**, XpressStore provides merchants with the tools to manage products, inventory, storefronts, orders, and payments.

## What Merchants Can Do

* Create and manage a business storefront
* Add, edit, and organize products
* Manage product visibility and inventory
* Create product variants
* Search and browse products
* Receive and manage orders
* Configure settlement accounts
* Accept payments
* Manage their business from a mobile application

---

# Current Status

> 🚧 XpressStore is actively being developed. Core authentication, onboarding, product management foundations, and the merchant dashboard are currently implemented, with commerce and analytics features planned for future phases.

---

# Foundation ✅

## Project Setup

* Expo SDK 56
* React Native
* TypeScript
* Expo Router
* Path Aliases
* ESLint
* Prettier
* Environment Configuration

## Architecture

* Feature-Based Folder Structure
* Route Constants System
* Reusable API and Service Layer
* Supabase Integration
* TanStack Query Setup
* Zustand State Management
* MMKV Storage
* Reusable Design System
* Shared Providers

---

# Authentication & Onboarding ✅

## Authentication

* Welcome Screen
* User Registration
* Login
* Forgot Password
* Password Reset Flow
* Email Verification
* OTP Verification
* Password Validation
* Show / Hide Password Controls
* Supabase Authentication Integration

## Onboarding

### Step 1 — Business Account Creation

Create and initialize a merchant business account.

### Step 2 — Business Details

* Business Name
* Business Address
* Business Type
* Business Category

### Step 3 — ID Verification

Merchant identity verification flow.

### Step 4 — Biometric Verification

Biometric verification flow for merchant onboarding.

### Onboarding Features

* Progress Indicators
* Multi-Step Navigation
* Form Validation
* Persistent Form State
* Supabase Integration

---

# Merchant Dashboard 🚧

## Bottom Navigation

* Home
* Products
* Orders
* Store
* More

## Home

* Merchant Dashboard Layout
* Business Overview
* Quick Actions
* Dashboard Data Fetching
* Pull-to-Refresh Support
* Loading States
* Refresh States
* Settlement Account Status Handling
* Settlement Account Pending Banner

## Data Management

* TanStack Query Data Fetching
* Query Cache Management
* Query Invalidation
* Refetching After Data Changes
* Shared Loading and Refresh States

---

# Product Management 🚧

## Product List

* Product Grid
* Product Cards
* Product Visibility Toggle
* Product Search Foundation
* Product Details Navigation
* Pull-to-Refresh
* Loading States
* Empty States
* Swipe-to-Delete Interactions
* Product Cache Invalidation

## Product Details

* Dynamic Product Routes
* Product Information Screen
* Product Data Fetching

## Product Creation Wizard

A multi-step product creation flow designed to guide merchants through creating and publishing products.

### Step 1 — Product Information

* Product Image Upload
* Camera Integration
* Gallery Upload
* Product Name
* Product Description
* Character Counter
* Category Selection
* Custom Category Creation

### Step 2 — Pricing & Inventory

* Selling Price
* Cost Price
* Inventory Setup
* SKU Generation

### Step 3 — Product Variants

* Size Variants
* Color Variants
* Product Options

### Step 4 — Storefront Settings

* Product Visibility
* Featured Product Settings

### Step 5 — Review & Publish

* Product Summary
* Product Review
* Publish Product

---

# Settlement Accounts 🚧

XpressStore includes the foundation for merchant settlement account management.

## Current Features

* Settlement Account Detection
* Account Status Handling
* Pending Account State
* Dashboard Settlement Banner
* Query-Based Data Refreshing

Future improvements will include full account creation, verification, management, and payout functionality.

---

# Design System ✅

XpressStore uses a reusable design system to maintain consistency across screens and features.

## Typography

* Headings
* Body Text
* Labels
* Captions
* Button Text

## Core Components

* AppText
* Button
* Input
* Dropdown
* NumberInput
* OTPInput
* ProgressBar
* Divider
* Card

## Product Components

* ImageActionCard
* Product Cards
* Product Visibility Controls
* Product List Components
* Product Action Components

## Feedback States

* Loading
* Refreshing
* Default
* Focus
* Disabled
* Error
* Success
* Empty States

## Theme Tokens

* Colors
* Typography
* Border Radius
* Spacing
* Shadows
* Semantic Theme System

---

# Data Fetching & State Management

## TanStack Query

TanStack Query is used for server-state management.

Current patterns include:

* Data Fetching
* Query Caching
* Query Invalidation
* Refetching
* Pull-to-Refresh
* Loading States
* Mutation Handling
* Cache Synchronization After Updates and Deletes

## Zustand

Zustand is used for lightweight client-side state management.

## MMKV

MMKV is used for fast local storage and persistent application state.

---

# Supabase

## Authentication

* User Registration
* Login
* Email Verification
* OTP Verification
* Password Recovery
* Password Reset

## Database

XpressStore uses Supabase as its backend platform for application data.

### Business Categories

```sql
create table business_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);
```

## Row Level Security

Example policy for publicly readable business categories:

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
│   ├── settlement
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

## Mobile

* React Native
* Expo
* TypeScript
* Expo Router

## Server State

* TanStack Query

## Client State

* Zustand

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

* [x] Authentication
* [x] Onboarding
* [x] Design System
* [x] Navigation
* [x] Supabase Integration
* [x] State Management
* [x] Server-State Management

---

## Phase 2 — Merchant Dashboard 🚧

* [x] Dashboard Layout
* [x] Quick Actions
* [x] Merchant Overview
* [x] Pull-to-Refresh
* [x] Loading States
* [x] Settlement Account Status Foundation
* [x] Revenue Summary

---

## Phase 3 — Product Management 🚧

* [x] Product Creation Foundation
* [x] Multi-Step Product Wizard
* [x] Product Images
* [x] Product Categories
* [x] Product Variants
* [x] Product Visibility Controls
* [x] Product Details
* [x] Product Search Foundation
* [x] Swipe-to-Delete Interactions
* [x] Product Editing

---

## Phase 4 — Storefront

* [x] Store Configuration
* [x] Public Storefront
* [x] Product Publishing
* [x] Featured Products
* [x] Store Customization

---

# Author

**Jeremiah Akinsowon**

Product Designer → Frontend Engineer→ Mobile Engineer (React Native)

Building **XpressStore** publicly while transitioning into Frontend Engineering and specialising in React Native development.

---

# Project Goals

XpressStore is being built as a real-world portfolio project focused on demonstrating modern mobile application development practices.

Key areas of focus include:

* Mobile Application Architecture
* React Native Development
* Server-State Management
* API Integration
* Authentication
* Form Management and Validation
* Reusable Component Systems
* Mobile Navigation
* Backend Integration
* Cache Management
* Performance
* Scalable Feature Architecture

The project is being developed publicly as part of an ongoing journey into professional frontend and mobile application development.


