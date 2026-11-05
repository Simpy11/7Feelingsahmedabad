# 7Feelings Ahmedabad storefront

Frontend-only React and Vite wholesale catalogue demonstration.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Run `npm run build` to create a production build in `dist/`.

## Retailer demo

Open **Retailer sign in**, complete the required business form and submit. The application is stored in this browser's LocalStorage and shown as **Pending approval**. Use **Approve demo** or **Reset to pending** to preview the approval state. This is a local demonstration only: it does not transmit form data, verify a business or expose prices.

The **Retailer sign in** link opens a demo sign-in form. It matches the email and mobile number against this browser's saved application; a pending application remains pending, while a demo-approved application can preview a local signed-in state. No password, backend account or real authentication is used.

The enquiry cart and wishlist also persist in LocalStorage. Cart quantities are complete sets; unknown size breakups, set contents, prices and stock are intentionally left for the 7Feelings team to confirm.

## Catalogue UI

The home page uses touch-friendly, scroll-snap catalogue carousels with previous / next controls. Product cards offer a quick-view dialog, wishlist toggle and complete-set enquiry controls. The header stays sticky; compact mobile navigation is fixed at the bottom. These are catalogue presentation features only, not verified new-arrival, bestseller or stock labels.

## Catalogue assets and product information

The first three alphabetically sorted JPEGs in `images/` are used as campaign photography. Remaining JPEGs are included as visual catalogue references. New JPEGs added to `images/` appear in the catalogue automatically; the original assets are not renamed or edited. Reference codes and listing labels are demo values, not verified product SKUs.

The catalogue mapping and its generated reference fields are in `src/catalog.js`. Replace the generated reference records with confirmed manufacturer data when available: official name and SKU, product category, fabric, colours, sizes, set composition / size pack, MOQ, availability and approved wholesale price. Keep an image path associated with each confirmed style. Do not treat each supplied image as a distinct sellable style until the manufacturer verifies the catalogue.

All data is held in the browser. There is no backend, real account verification, file upload service or payment flow.
