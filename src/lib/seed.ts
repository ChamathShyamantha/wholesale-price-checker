// Starting data, taken from the original sourcing sheet (PDF).
// Seeded once into an empty database.

export const CATEGORIES = [
  "Jewellery",
  "Skincare",
  "Makeup",
  "Hair",
  "Perfume",
  "Bags",
  "Toys",
  "Fancy",
  "Home",
  "Packaging",
  "Other",
];

export const SEED_SHOPS = [
  { name: "King's Jewels", street: "2nd Cross St", address: "Underground Cosmetics Market (Thaika Plaza), 176/1 2nd Cross Street" },
  { name: "Thaika Plaza", street: "2nd Cross St", address: "Underground Cosmetics Market, 176/1 2nd Cross Street" },
  { name: "Importers (2nd Cross St)", street: "2nd Cross St", address: "" },
  { name: "Zain Cosmetics", street: "2nd Cross St", address: "" },
  { name: "Cosmetic Corner", street: "2nd Cross St", address: "" },
  { name: "CEAESSON", street: "Central Super Market & Market St", address: "No. 40, 3rd Floor, Central Super Market Complex" },
  { name: "Colombo Gold Center", street: "Central Super Market & Market St", address: "" },
  { name: "Perfume Bazaar / Perfume Lines / Fragrance Vault", street: "Main Street", address: "15, City Arcade, 209/211 Main Street" },
  { name: "Prince St fancy stalls", street: "Prince Street", address: "" },
  { name: "KYTE International", street: "Prince Street", address: "" },
  { name: "Fashion Bag", street: "Prince Street", address: "" },
  { name: "Importers (Prince St)", street: "Prince Street", address: "" },
  { name: "Toy wholesalers (Prince St / Main St)", street: "Prince Street", address: "" },
  { name: "Almadina Store / Pettah Fancy / La Divas Fancy", street: "Prince Street", address: "" },
  { name: "Zeylan / Burhani", street: "China St & Maliban St", address: "" },
  { name: "Care Packs Colombo (Pvt) Ltd", street: "China St & Maliban St", address: "23 Muthuwella Mawatha, Colombo 15" },
];

type SeedProduct = { name: string; category: string; pack?: number; notes?: string; shops: string[] };

export const SEED_PRODUCTS: SeedProduct[] = [
  { name: "Earring Stud Card (3-pair, butterfly)", category: "Jewellery", shops: ["King's Jewels"] },
  { name: "Butterfly Necklace", category: "Jewellery", shops: ["King's Jewels"] },
  { name: "Clover Set", category: "Jewellery", shops: ["King's Jewels"] },
  { name: "Hand Cream (cwinter / cqk 30g tube)", category: "Skincare", shops: ["Thaika Plaza"] },
  { name: "Eye Masks (Kormesis crystal collagen)", category: "Skincare", pack: 12, notes: "Dozen rate", shops: ["Thaika Plaza"] },
  { name: "Lip Masks (Sadoer cherry / collagen)", category: "Skincare", pack: 12, notes: "Dozen rate", shops: ["Thaika Plaza"] },
  { name: "Peach / Niacinamide Sheet Masks", category: "Skincare", pack: 12, notes: "Dozen rate", shops: ["Thaika Plaza"] },
  { name: "Hot Water Bag (500ml-1000ml rubber / plush)", category: "Home", shops: ["Importers (2nd Cross St)", "Importers (Prince St)"] },
  { name: "Tinted / Fruity Lip Balm", category: "Makeup", shops: ["Zain Cosmetics"] },
  { name: "Facial Razors", category: "Skincare", shops: ["Zain Cosmetics"] },
  { name: "Press-on Nails", category: "Makeup", shops: ["Zain Cosmetics"] },
  { name: "Handaiyan Lipsticks", category: "Makeup", shops: ["Cosmetic Corner"] },
  { name: "Nail Polish", category: "Makeup", shops: ["Cosmetic Corner"] },
  { name: "Eyeliner", category: "Makeup", shops: ["Cosmetic Corner"] },
  { name: "Satin / Organza Scrunchie", category: "Hair", shops: ["CEAESSON"] },
  { name: "Hair Clips (claw / mini card / matte / butterfly)", category: "Hair", shops: ["CEAESSON"] },
  { name: "Fancy Hair Bands", category: "Hair", shops: ["CEAESSON"] },
  { name: "Boxed Necklace & Earring Set", category: "Jewellery", shops: ["Colombo Gold Center"] },
  { name: "Mini / Pocket Perfume & Body Mists (VIP, Dove, Fogg, 9X, 18 Taan, Good Look)", category: "Perfume", shops: ["Perfume Bazaar / Perfume Lines / Fragrance Vault"] },
  { name: "Pocket Tissue Pack", category: "Fancy", shops: ["Prince St fancy stalls"] },
  { name: "Cosmetic Pouch", category: "Bags", shops: ["KYTE International"] },
  { name: "Ladies Pastel PU Wallet", category: "Bags", shops: ["Fashion Bag", "KYTE International"] },
  { name: "Mini Side Bag", category: "Bags", shops: ["Fashion Bag"] },
  { name: "Reversible Mood Octopus Plushie", category: "Toys", shops: ["Toy wholesalers (Prince St / Main St)"] },
  { name: "Labubu Plush Keychain / Mini Teddy Bear", category: "Toys", shops: ["Toy wholesalers (Prince St / Main St)"] },
  { name: "Pocket Mirror", category: "Fancy", shops: ["Almadina Store / Pettah Fancy / La Divas Fancy"] },
  { name: "Comb", category: "Fancy", shops: ["Almadina Store / Pettah Fancy / La Divas Fancy"] },
  { name: "Color-coordinated Fancy Items", category: "Fancy", shops: ["Almadina Store / Pettah Fancy / La Divas Fancy"] },
  { name: "Gift Box Small (3-ply + crinkle paper + ribbon)", category: "Packaging", shops: ["Zeylan / Burhani"] },
  { name: "Gift Box Medium (3-ply + crinkle paper + ribbon)", category: "Packaging", shops: [] },
  { name: "Courier Box 3-ply", category: "Packaging", notes: "MOQ from 10 boxes per size", shops: ["Care Packs Colombo (Pvt) Ltd"] },
];

export const SEED_LEADS = SEED_PRODUCTS.flatMap((p) => p.shops.map((s) => ({ p: p.name, s })));
