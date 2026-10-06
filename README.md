# XpressStore Mobile App

XpressStore is a **React Native mobile commerce and payments platform** designed to help merchants manage their businesses, products, orders, transactions, storefronts, settlements, and payment activity from a single mobile application.

The project is being built with **React Native, Expo, TypeScript, Expo Router, Supabase, TanStack Query, Zustand, React Hook Form, MMKV, and SQLite**, with a strong focus on scalable mobile architecture, reusable UI components, server-state management, performance, and production-quality UX.

---

## Overview

XpressStore is designed around the day-to-day needs of merchants.

Merchants can manage:

- Business information
- Products and inventory
- Product variants
- Storefronts
- Orders
- Transactions
- Payment activity
- Settlement accounts
- Notifications
- Payment links
- Receipts
- Business performance metrics

The application is being developed as a real-world fintech/commerce mobile application and as a portfolio project demonstrating modern **React Native and TypeScript engineering practices**.

---

# Current Status

> 🚧 XpressStore is actively under development.

The project has progressed from its initial authentication and onboarding foundation into a broader merchant application with implemented dashboard, product management, orders, transactions, receipts, storefront, settlement-account, and notification experiences.

Current development is focused on:

- Completing merchant workflows
- Connecting UI flows to backend services
- Improving data synchronization
- Refining empty, loading, error, and refresh states
- Improving mobile UX and accessibility
- Strengthening reusable component architecture
- Expanding API integration
- Preparing the application for production-style usage

---

# Core Features

## Authentication & Onboarding

### Authentication

- Welcome screen
- User registration
- Login
- Forgot password
- Password reset
- Email verification
- OTP verification
- Password validation
- Show/hide password controls
- Supabase authentication integration

### Merchant Onboarding

The onboarding experience is structured as a multi-step flow.

#### Business Account

- Business account creation
- Merchant initialization

#### Business Details

- Business name
- Business address
- Business type
- Business category

#### Identity Verification

- Merchant identity verification flow
- Verification states

#### Biometric Verification

- Biometric verification flow
- Verification state handling

### Onboarding UX

- Multi-step navigation
- Progress indicators
- Form validation
- Persistent form state
- Loading states
- Error handling
- Supabase integration

---

# Merchant Dashboard

The Home screen provides merchants with an overview of their business activity.

## Dashboard

- Merchant greeting
- Business overview
- Today's revenue
- Revenue growth
- Transaction metrics
- Paid transaction count
- Pending transaction count
- Recent transactions
- Quick actions
- Storefront shortcut
- Payment Link shortcut
- Notification entry point
- Pull-to-refresh

## Dashboard Data

The dashboard uses server-state management to retrieve and refresh merchant data.

Implemented patterns include:

- Dashboard data fetching
- Transaction data fetching
- Query caching
- Query invalidation
- Refetching
- Pull-to-refresh
- Loading states
- Refresh states
- Derived dashboard metrics

---

# Transactions

Transactions are one of the main merchant-management experiences in XpressStore.

## Transaction List

Implemented functionality includes:

- Transaction list
- Transaction cards
- Transaction status
- Payment channel
- Transaction type
- Customer information
- Transaction amount
- Transaction reference
- Transaction ID
- Transaction date
- Currency formatting
- Recent transaction display

## Search

Transactions can be searched using:

- Customer name
- Transaction reference
- Transaction ID
- Transaction amount

## Filtering

The transaction experience includes a dedicated filter workflow.

Supported filters include:

- Status
- Payment channel
- Transaction type
- Amount range
- Date range

### Transaction Status

- All
- Paid
- Pending
- Failed

The filter interface uses a reusable bottom-sheet component.

## Transaction Summary

The transaction screen provides a dynamic summary showing:

- Transaction value
- Transaction count
- Active transaction category/status
- Filtered transaction totals

## Refresh

Transactions support:

- Pull-to-refresh
- Loading state
- Refetching
- Empty states
- Filter-aware results

## Transaction Details

Merchants can open individual transactions to view detailed information and access receipt-related actions.

---

# Orders

The order-management experience provides merchants with detailed order information and customer context.

Implemented functionality includes:

- Order list foundation
- Order details
- Order status
- Order status badge
- Customer information
- Order totals
- Order timeline
- Timeline dates
- Order actions
- Customer communication actions
- Receipt access

## Order Status

Order status configuration has been centralized into reusable configuration and UI components.

This allows status presentation to remain consistent across the application.

---

# Receipts

XpressStore includes a reusable receipt architecture shared between transactions and orders.

## Receipt System

Implemented features include:

- Shared receipt model
- Transaction-to-receipt mapping
- Order-to-receipt mapping
- Receipt verification information
- Receipt metadata
- Receipt template
- Receipt viewer
- Receipt actions
- PDF receipt generation
- Receipt sharing
- Receipt saving

## Receipt Architecture

Receipts are generated from normalized receipt data rather than being tightly coupled to individual transaction or order implementations.

This allows the same receipt system to support multiple sources.

```text
Transaction
     │
     ▼
Receipt Adapter
     │
     ▼
Shared Receipt Model
     │
     ├── Receipt Template
     ├── Verification
     ├── PDF Generation
     └── Share / Save
```

---

# Product Management

XpressStore provides merchants with product-management functionality for their storefront.

## Product List

Implemented functionality includes:

- Product grid
- Product cards
- Product visibility
- Product search foundation
- Product details navigation
- Pull-to-refresh
- Loading states
- Empty states
- Swipe-to-delete interactions
- Cache invalidation
- Product editing

## Product Details

- Dynamic product routes
- Product information screen
- Product data fetching
- Product editing

## Product Creation Wizard

The product creation experience is structured as a multi-step workflow.

### Step 1 — Product Information

- Product image upload
- Camera integration
- Gallery selection
- Product name
- Product description
- Character counter
- Category selection
- Custom category creation

### Step 2 — Pricing & Inventory

- Selling price
- Cost price
- Inventory setup
- SKU generation

### Step 3 — Product Variants

- Size variants
- Colour variants
- Product options

### Step 4 — Storefront Settings

- Product visibility
- Featured product configuration

### Step 5 — Review & Publish

- Product summary
- Product review
- Publish workflow

---

# Storefront

XpressStore includes merchant storefront functionality.

Implemented areas include:

- Store configuration
- Storefront navigation
- Product publishing
- Featured products
- Store customization
- Storefront access from the merchant dashboard

---

# Settlement Accounts

Settlement Accounts provide merchants with a dedicated area for managing and reviewing settlement information.

## Current Experience

- Settlement account navigation
- Dedicated Settlement screen
- Settlement summary structure
- Settlement history structure
- Payout information structure
- Empty-state experience
- Loading/empty-state UX foundation
- Integration points for settlement data

The settlement experience is being developed to support future:

- Settlement account creation
- Bank selection
- Account verification
- Account management
- Settlement history
- Payout information

---

# Notifications

XpressStore includes a dedicated notifications area for merchant communication and activity updates.

Current work includes:

- Notification entry point
- Notifications screen
- Notification list UI
- Notification empty state
- Notification navigation
- Notification presentation patterns
- Notification-related API integration foundation

The notification architecture is designed to support future push notification and notification-preference functionality.

---

# Payment Links

The merchant dashboard provides quick access to payment-link functionality.

Payment links are intended to allow merchants to create and share payment experiences without requiring customers to navigate directly through the storefront.

---

# Design System

XpressStore uses a reusable design system to maintain consistency across the application.

## Typography

- Headings
- Body text
- Labels
- Captions
- Button text

## Core Components

- `AppText`
- `Button`
- `Input`
- `SearchBar`
- `Dropdown`
- `NumberInput`
- `OTPInput`
- `ProgressBar`
- `Divider`
- `Card`
- `UICard`
- `FilterButton`

## Product Components

- Product cards
- Product list components
- Image action cards
- Product visibility controls
- Product action components

## Transaction Components

- Transaction list
- Transaction list item
- Transaction filters
- Transaction filter bottom sheet
- Transaction summary

## Receipt Components

- Receipt header
- Receipt metadata card
- Receipt action bar
- Receipt viewer
- Receipt error state

## Feedback States

The application uses reusable patterns for:

- Loading
- Refreshing
- Empty
- Error
- Success
- Disabled
- Focus
- Default

## Theme Tokens

- Colours
- Typography
- Border radius
- Spacing
- Shadows
- Semantic theme tokens

---

# Navigation

XpressStore uses **Expo Router** for file-based navigation.

The application is structured around several major route groups:

```text
app
├── (auth)
├── (onboarding)
├── (password-recovery)
├── (tabs)
│   ├── Home
│   ├── Products
│   ├── Orders
│   ├── Store
│   └── More
│       ├── Transactions
│       ├── Settlements
│       ├── Notifications
│       ├── Payment Settings
│       └── Settings
│
├── product
│   ├── [id]
│   └── add
│
├── orders
│   └── [id]
│
├── transactions
│   └── [id]
│
└── _layout.tsx
```

Route constants are also centralized to reduce navigation inconsistencies.

---

# Data Fetching & State Management

XpressStore uses **TanStack Query** for server-state management and **Zustand** for lightweight client-side state.

## TanStack Query

Current patterns include:

- API data fetching
- Query caching
- Query invalidation
- Refetching
- Pull-to-refresh
- Loading states
- Mutation handling
- Cache synchronization
- Post-mutation refetching
- Post-delete cache invalidation

Examples include:

```text
useProfile
useDashboardStats
useTransactions
```

## Zustand

Zustand is used for lightweight client-side state where global state is required without introducing unnecessary complexity.

---

# Local Storage & Offline Architecture

The application architecture includes multiple layers of local persistence.

## Secure Storage

**Expo SecureStore** is used for sensitive locally persisted values.

Potential use cases include:

- Authentication-related data
- Secure tokens
- Sensitive configuration

## Fast Local Storage

**MMKV** provides high-performance local storage for frequently accessed application state.

## Local Database

**Expo SQLite** provides a foundation for structured local persistence and future offline-first functionality.

## Architecture

```text
                  XpressStore Mobile App
                           │
                           ▼
                    React Native UI
                           │
                           ▼
                    Feature Modules
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      TanStack Query                  Zustand
      Server State                  Client State
             │                           │
             ▼                           ▼
          Supabase                 Local State
             │
             ▼
       PostgreSQL / API
             │
             ▼
      Local Persistence
      ├── SecureStore
      ├── MMKV
      └── SQLite
```

---

# Supabase

Supabase provides the backend foundation for authentication and application data.

## Authentication

- User registration
- Login
- Email verification
- OTP verification
- Password recovery
- Password reset

## Database

Supabase/PostgreSQL is used for application data including merchant and product-related information.

## Row Level Security

Database access is designed around Supabase Row Level Security policies to ensure data is appropriately scoped.

Example:

```sql
create policy "Allow public read"
on public.business_categories
for select
to anon
using (true);
```

---

# API Architecture

The project includes documented API integration areas covering:

- Authentication
- Dashboard
- Store
- Products
- Orders
- Invoices
- Payment pages
- Profile
- Settlement accounts
- Payment methods
- Notifications
- Transactions

The application is structured so API/service logic remains separate from presentation components.

---

# Project Structure

```text
app
├── (auth)
├── (onboarding)
├── (password-recovery)
├── (tabs)
│   ├── index.tsx
│   ├── products
│   ├── orders
│   ├── store
│   └── more
│       ├── transactions
│       ├── settlements
│       ├── notifications
│       ├── payment-settings
│       └── settings
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
├── orders
│   └── [id]
│
├── transactions
│   └── [id]
│
└── _layout.tsx

src
├── components
│   ├── ui
│   ├── product
│   ├── dashboard
│   ├── transactions
│   ├── orders
│   ├── receipt
│   └── bottom-sheet
│
├── features
│   ├── auth
│   ├── business
│   ├── products
│   ├── settlement
│   └── storefront
│
├── hooks
│   ├── transactions
│   ├── dashboard
│   └── ...
│
├── navigation
├── providers
├── services
│   ├── transactions
│   └── receipt
├── storage
├── theme
├── types
├── utils
└── lib
```

---

# Technology Stack

## Mobile

- React Native
- Expo SDK 57
- TypeScript
- Expo Router

## State & Data

- TanStack Query
- Zustand

## Forms & Validation

- React Hook Form
- Zod

## Backend

- Supabase
- PostgreSQL
- REST APIs
- GraphQL integration

## Storage

- Expo SecureStore
- MMKV
- Expo SQLite

## UI

- React Native
- Expo Vector Icons
- Custom design system
- Bottom sheets
- Reusable UI components

## Development

- ESLint
- Prettier
- TypeScript
- Expo Doctor
- Git
- GitHub

---

# Architecture Principles

The project is being developed around several engineering principles:

### Feature-Based Architecture

Features are separated into dedicated modules rather than placing all business logic inside screens.

### Reusable Components

Common UI patterns are extracted into reusable components to maintain consistency.

### Separation of Concerns

Screens focus on presentation and interaction while:

- Hooks manage data access
- Services manage business/API operations
- Types define application contracts
- Utilities handle shared transformations
- Theme tokens control visual consistency

### Server-State Management

TanStack Query handles:

- Fetching
- Caching
- Refetching
- Synchronization
- Loading states

### Reusable Data Models

Shared models are used across features.

For example, the receipt architecture allows both:

```text
Order → Receipt
Transaction → Receipt
```

to use the same receipt-generation and verification pipeline.

---

# UX & Interaction Patterns

The application places strong emphasis on mobile interaction quality.

Implemented patterns include:

- Pull-to-refresh
- Swipe-to-delete
- Bottom-sheet filters
- Search
- Filter chips
- Dynamic empty states
- Loading states
- Error states
- Success states
- Disabled states
- Confirmation interactions
- Dynamic status indicators
- Contextual navigation
- Reusable cards
- Consistent spacing and typography

---

# Roadmap

## Phase 1 — Foundation ✅

- [x] React Native application
- [x] Expo
- [x] TypeScript
- [x] Expo Router
- [x] Authentication
- [x] Onboarding
- [x] Navigation
- [x] Design system
- [x] Supabase integration
- [x] TanStack Query
- [x] Zustand
- [x] MMKV
- [x] Secure storage foundation
- [x] SQLite foundation

---

## Phase 2 — Merchant Dashboard ✅ / 🚧

- [x] Dashboard layout
- [x] Merchant greeting
- [x] Revenue summary
- [x] Transaction metrics
- [x] Quick actions
- [x] Recent transactions
- [x] View all transactions
- [x] Pull-to-refresh
- [x] Loading states
- [x] Refresh states
- [x] Settlement account status foundation
- [ ] Complete production API integration

---

## Phase 3 — Product Management ✅ / 🚧

- [x] Product list
- [x] Product cards
- [x] Product creation
- [x] Multi-step product wizard
- [x] Product images
- [x] Camera integration
- [x] Product categories
- [x] Product variants
- [x] Product visibility
- [x] Product details
- [x] Product search foundation
- [x] Product editing
- [x] Swipe-to-delete
- [x] Cache invalidation
- [ ] Complete production API integration

---

## Phase 4 — Orders & Receipts ✅ / 🚧

- [x] Order details
- [x] Order status
- [x] Customer information
- [x] Order totals
- [x] Order timeline
- [x] Customer communication actions
- [x] Receipt viewer
- [x] Receipt metadata
- [x] Shared receipt model
- [x] Order receipt generation
- [x] Transaction receipt generation
- [x] PDF receipt generation
- [x] Receipt sharing
- [x] Receipt verification
- [ ] Complete production API integration

---

## Phase 5 — Transactions 🚧

- [x] Transaction list
- [x] Transaction details
- [x] Transaction status
- [x] Transaction search
- [x] Status filtering
- [x] Payment-channel filtering
- [x] Transaction-type filtering
- [x] Amount filtering
- [x] Date filtering
- [x] Filter bottom sheet
- [x] Transaction summary
- [x] Transaction counts
- [x] Transaction value calculations
- [x] Pull-to-refresh
- [x] Empty states
- [ ] Production API integration
- [ ] Server-side pagination
- [ ] Advanced transaction analytics

---

## Phase 6 — Settlement Accounts 🚧

- [x] Settlement navigation
- [x] Settlement screen
- [x] Settlement summary foundation
- [x] Settlement history foundation
- [x] Empty-state experience
- [ ] Settlement account creation
- [ ] Bank selection
- [ ] Account verification
- [ ] Account management
- [ ] Settlement history integration
- [ ] Payout information integration

---

## Phase 7 — Notifications 🚧

- [x] Notification entry point
- [x] Notification screen
- [x] Notification list UI
- [x] Empty state
- [x] Notification navigation
- [ ] Push notification integration
- [ ] Notification read/unread state
- [ ] Notification preferences
- [ ] Notification API integration

---

## Phase 8 — Payments & Storefront 🚧

- [x] Storefront foundation
- [x] Store customization foundation
- [x] Payment Link entry point
- [x] Product publishing
- [x] Featured products
- [ ] Complete payment-link workflow
- [ ] Complete checkout workflow
- [ ] Production payment integration

---

# What This Project Demonstrates

XpressStore is being developed to demonstrate practical experience with modern mobile engineering.

Key areas include:

- React Native
- TypeScript
- Expo
- Expo Router
- Mobile application architecture
- Feature-based architecture
- TanStack Query
- Zustand
- Supabase
- PostgreSQL
- REST API integration
- GraphQL
- Authentication
- Secure storage
- Local persistence
- SQLite
- MMKV
- Form management
- Validation
- Reusable component architecture
- Design systems
- Bottom sheets
- Search and filtering
- Pull-to-refresh
- Cache invalidation
- Receipt generation
- PDF generation
- Mobile UX
- Accessibility
- Error and empty states
- Performance-conscious rendering

---

# Project Goals

The goal of XpressStore is to build a realistic merchant-facing mobile application while demonstrating the engineering skills required for professional **Frontend and React Native Mobile Engineer** roles.

The project focuses on:

1. Building a production-style React Native application.
2. Developing scalable TypeScript architecture.
3. Integrating real backend services.
4. Managing server and client state correctly.
5. Building reusable UI components.
6. Implementing complex merchant workflows.
7. Handling loading, error, refresh, and empty states.
8. Creating consistent mobile UX.
9. Applying modern React patterns.
10. Demonstrating end-to-end feature development.

---

# Author

**Jeremiah Akinsowon**

XpressStore is being developed as a hands-on project while transitioning from product design into professional frontend and mobile engineering.

---

# GitHub

Repository:

**[jaa38/xpressstore-app](https://github.com/jaa38/xpressstore-app)**

---

## Project Focus

> **Design it. Build it. Test it. Ship it.**

XpressStore is an ongoing exploration of what it takes to design and engineer a modern merchant-focused mobile application using React Native and TypeScript.
