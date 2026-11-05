const productImages = Object.entries(
  import.meta.glob('../images/*.jpeg', { eager: true, import: 'default', query: '?url' }),
)
  .sort(([first], [second]) => first.localeCompare(second))
  .map(([source, image]) => ({ source, image }));

export const campaignImages = productImages.slice(0, 3).map(({ image }) => image);

export const products = productImages.slice(3).map(({ source, image }, index) => {
  const number = String(index + 1).padStart(3, '0');
  const filename = source.split('/').pop().replace(/\.jpeg$/i, '');
  const stableId = filename.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
  return {
    id: `visual-${stableId}`,
    name: `Ethnic wear catalogue · ${number}`,
    code: `7F-REF-${number}`,
    category: 'Kurtis & ethnic wear',
    type: 'Kurta / ethnic wear',
    searchTerms: 'printed ethnic wear kurta',
    fabric: 'Confirm with 7Feelings',
    color: 'Confirm with 7Feelings',
    sizes: 'Confirm with 7Feelings',
    image,
    images: [image],
    note: 'Reference code is for this website demo only; it is not a verified manufacturer SKU.',
    description:
      'A visual catalogue reference from the supplied 7Feelings collection. Please contact the team to confirm the style, fabric, available colours and sizes, set contents, minimum order and wholesale pricing.',
    setPack: null,
    minimumSets: 1,
  };
});

export const categories = [
  { name: 'Kurtis & ethnic wear', image: products[2]?.image },
  { name: 'Printed styles', image: products[8]?.image },
  { name: 'Colourful collection', image: products[17]?.image },
];
