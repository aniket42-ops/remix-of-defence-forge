# Remix of Defence Forge

Create a modern React web application for a Defence Manufacturing Services company that showcases products and allows users to request quotes for product variants.

The application should look industrial, technical, and clean (defence catalogue style) similar to military equipment specification sheets.

Tech Stack

Use the following stack:

React (Vite)

React Router

Firebase

Firestore Database

Firebase Hosting

Tailwind CSS

Component based architecture

Application Flow

The website represents a defence equipment catalogue + quotation system.

Users can:

Browse categories

Browse sub categories

View product variants

Request quotes

See estimated price

Submit enquiry

Admins can:

Add/edit/delete products

Configure pricing

Manage quotes

Control product visibility

Delete variants (removes from user side instantly)

Page Structure

1 Home Page

Route:

/


Display 4 categories as cards.

Categories:

Telescopic Masts

Tripods

Pedestals

Multi Function Active Junction Box

Each card must show:

Image

Category title

Short description

Explore button

When clicked navigate to:

/category/:categoryName


Example:

/category/telescopic-masts


2 Category Page

Route:

/category/:categoryName


This page shows sub categories.

Example:

Telescopic Masts

Light Duty PTM Masts

Medium Duty PTM Masts

Heavy Duty PTM Masts

Display them as cards.

Each card contains:

image

title

explore button

Click → navigate to

/category/:categoryName/:subCategory


3 Product Variant Page

Route:

/category/:category/:subCategory


This page shows all product variants.

Display in technical specification table layout like engineering datasheets.

Example columns:

Model No
Height Retracted
Height Erected
Head Load
Wind Area
Wind Speed Operational
Wind Speed Survival
Sway
Weight
No of Sections
Tube Diameter
Guy Ropes
Tripod Weight


Each row should have:

Get Quote button


Product Variant Example

PP15P-5-1.7M-01
PP15P-9-2.5M-01
PP10P-12-2.8M-01
PP15P-15-3.3M-01


Quote Modal

When user clicks Get Quote, open a modal.

Form fields:

Name
Company Name
Email
Phone
Country
Quantity
Message


Hidden fields:

Category
Sub Category
Product Model


Estimated Quote Feature

Before submitting the form, the system should calculate estimated price automatically.

Estimated price formula:

Estimated Price = Base Price × Quantity


Show in modal:

Estimated Quote: ₹ XXXXX


Base price will come from admin pricing configuration.

After submit:

Quote request submitted successfully


Save data in Firestore.

Firestore Structure

products collection

products
   telescopic-masts
        subCategories
            light-duty
                 variants[]
            medium-duty
                 variants[]


Variant example:

{
 modelNo: "PP15P-5-1.7M-01",
 heightRetracted: 1.7,
 heightErected: 6,
 headLoad: 15,
 windArea: 0.25,
 windSpeedOperational: 80,
 windSpeedSurvival: 120,
 sway: "<2°",
 weight: 22,
 sections: 6,
 tubeDia: "50-100",
 guyRopes: "3 x 2",
 tripodWeight: 8,
 basePrice: 45000
}


Quotes Collection

quotes


Example document:

{
 name: "",
 company: "",
 email: "",
 phone: "",
 country: "",
 quantity: "",
 message: "",
 category: "Telescopic Masts",
 subCategory: "Light Duty PTM Masts",
 productModel: "PP15P-5-1.7M-01",
 estimatedPrice: "",
 createdAt: timestamp
}


Admin Dashboard

Route:

/admin


Admin panel should contain sections:

Dashboard
Products
Pricing
Quotes
Settings


Admin Features

Admin should be able to:

Add Product Variant

Add new variant with specs.

Edit Variant

Modify product specifications.

Delete Variant

If admin deletes a variant:

It must instantly disappear from user side


Pricing Configuration

Admin can configure:

Base price per product
Category pricing
Custom price rules


Example pricing document:

pricing
   telescopic-masts
        basePrice: 45000


Admin changes → user estimated price updates automatically.

Admin Quote Management

Admin page should display all quote requests.

Columns:

Date
Customer Name
Company
Product Model
Quantity
Estimated Price
Email
Phone
Status


Admin actions:

Mark as contacted
Delete quote
Export CSV


Bonus Features

Add the following features.

Product Search

Search by model number.

Product Filters

Filter by:

Height
Head Load
Weight
Sections


Datasheet Download

Add button:

Download Datasheet


Generate PDF specification sheet.

Industrial UI Design

Design theme should look like:

Defence equipment catalogue
Military engineering style
Technical tables
Industrial blue / steel grey
Clean grid layout


Use Tailwind components.

Component Structure

Create reusable components.

components

Navbar
Footer
CategoryCard
SubCategoryCard
ProductTable
QuoteModal
SearchBar
FilterPanel
AdminSidebar
AdminProductTable
AdminQuoteTable


Routing Structure

/                         → Home
/category/:category       → Subcategories
/category/:category/:sub  → Product variants
/admin                    → Admin dashboard
/admin/products           → Manage products
/admin/pricing            → Configure pricing
/admin/quotes             → Manage quote requests


Important Functional Requirements

The application must support:

Real-time updates

If admin:

adds product
edits product
deletes product
changes price


Changes should reflect instantly on user side using Firestore listeners.

UI Style

Use:

industrial
defence manufacturing
technical datasheet layout
dark blue / grey theme
clean tables
grid cards


The design should resemble military equipment catalog websites.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e0fe5005-290e-45af-8fb5-c1df32d54b0a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
