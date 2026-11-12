// Guided tour: each step opens a real screen and spotlights one element marked with data-tour="...".

type Text = { title: string; body: string };

export type TourStep = {
  /** Where to go for this step. */
  path: string;
  /** The step is shown once the current page matches this. */
  match: RegExp;
  /** data-tour value of the element to spotlight. */
  target: string;
  en: Text;
  si: Text;
};

const ITEMS = /^\/$/;
const ADD = /^\/add$/;
const ITEM = /^\/products\/\d+$/;
const SHOPS = /^\/shops$/;
const SHOP = /^\/shops\/\d+$/;
const LIST = /^\/list$/;

export const TOUR_STEPS: TourStep[] = [
  {
    path: "/",
    match: ITEMS,
    target: "items-header",
    en: { title: "Items screen", body: "This is the list of everything you're sourcing. It shows how many items are priced and how many are still to check." },
    si: { title: "Items තිරය", body: "ඔබ සොයන සියලුම භාණ්ඩ මෙහි ඇත. මිල දැමූ සහ තවම බලන්න ඉතිරි භාණ්ඩ ගණන මෙහි පෙන්වයි." },
  },
  {
    path: "/",
    match: ITEMS,
    target: "item-search",
    en: { title: "Search", body: "Type part of a name to find an item quickly." },
    si: { title: "සෙවීම", body: "භාණ්ඩයක් ඉක්මනින් සොයා ගැනීමට නමේ කොටසක් ටයිප් කරන්න." },
  },
  {
    path: "/",
    match: ITEMS,
    target: "filter-status",
    en: { title: "Filters", body: "“To check” = not priced yet. “Priced” = done. “No retail price” = you haven't set your selling price yet." },
    si: { title: "පෙරහන්", body: "“To check” = තවම මිල බලලා නැති ඒවා. “Priced” = මිල දැමූ ඒවා. “No retail price” = විකුණන මිල තවම දාලා නැති ඒවා." },
  },
  {
    path: "/",
    match: ITEMS,
    target: "filter-street",
    en: { title: "Streets", body: "Tap the street you're walking to see only the items sold there. The app remembers your choice." },
    si: { title: "වීදි", body: "ඔබ ඇවිදින වීදිය ඔබන්න. එම වීදියේ විකුණන භාණ්ඩ පමණක් පෙන්වයි. ඇප් එක ඔබේ තේරීම මතක තබා ගනී." },
  },
  {
    path: "/",
    match: ITEMS,
    target: "item-card",
    en: { title: "An item", body: "Green price = the cheapest price per piece, and the shop that has it. Orange “Not checked yet” = no prices yet. Tap a card to open the item." },
    si: { title: "භාණ්ඩයක්", body: "කොළ පාට මිල = එක කෑල්ලක අඩුම මිල සහ එය ඇති කඩය. තැඹිලි “Not checked yet” = තවම මිල නැහැ. විවෘත කිරීමට කාඩ් එක ඔබන්න." },
  },
  {
    path: "/",
    match: ITEMS,
    target: "export",
    en: { title: "Export to Excel", body: "Downloads every price as a file that opens in Excel or Google Sheets." },
    si: { title: "Excel වලට", body: "සියලු මිල Excel හෝ Google Sheets වලින් විවෘත කළ හැකි ගොනුවක් ලෙස බාගත කරයි." },
  },
  {
    path: "/",
    match: ITEMS,
    target: "nav-add",
    en: { title: "Add a price", body: "Tap this whenever a shop tells you a price. Let's look at it now." },
    si: { title: "මිලක් දාන්න", body: "කඩයකින් මිලක් කිව්වම මෙය ඔබන්න. අපි දැන් එය බලමු." },
  },
  {
    path: "/add",
    match: ADD,
    target: "add-shop",
    en: { title: "1. Pick the shop", body: "Search and tap the shop. It stays selected for the next item, so pricing many items in one shop is quick. Not in the list? Tap “+ New shop”." },
    si: { title: "1. කඩය තෝරන්න", body: "කඩය සොයා ඔබන්න. ඊළඟ භාණ්ඩයටත් එම කඩයම තෝරාගෙන තිබේ. ලැයිස්තුවේ නැත්නම් “+ New shop” ඔබන්න." },
  },
  {
    path: "/add",
    match: ADD,
    target: "add-item",
    en: { title: "2. Pick the item", body: "Search and tap the item. A new item? Tap “+ New item”." },
    si: { title: "2. භාණ්ඩය තෝරන්න", body: "භාණ්ඩය සොයා ඔබන්න. අලුත් භාණ්ඩයක් නම් “+ New item” ඔබන්න." },
  },
  {
    path: "/add",
    match: ADD,
    target: "add-price",
    en: { title: "3. Type the price", body: "Type the wholesale price the shop gives you. As you type, the app tells you if another shop is cheaper, or if this is a new best price." },
    si: { title: "3. මිල ටයිප් කරන්න", body: "කඩේ කියන තොග මිල ටයිප් කරන්න. ටයිප් කරන විටම වෙනත් කඩයක අඩුද, නැත්නම් මේක අලුත්ම අඩුම මිලද කියා ඇප් එක පෙන්වයි." },
  },
  {
    path: "/add",
    match: ADD,
    target: "add-pack",
    en: { title: "4. For how many pieces?", body: "Price for one piece? Leave “1 piece”. For 12, tap “Dozen”, or type the number of pieces. Prices are always compared per piece." },
    si: { title: "4. කෑලි කීයකටද?", body: "එක කෑල්ලක මිල නම් “1 piece” තියන්න. කෑලි 12කට නම් “Dozen” ඔබන්න, නැත්නම් කෑලි ගණන ටයිප් කරන්න. මිල සසඳන්නේ සැමවිටම එක කෑල්ලක් අනුවයි." },
  },
  {
    path: "/add",
    match: ADD,
    target: "add-extras",
    en: { title: "Extras (optional)", body: "Add a minimum order (MOQ), a note, or a photo of the item or its price tag." },
    si: { title: "අමතර (අවශ්‍ය නම්)", body: "අවම ඇණවුම (MOQ), සටහනක්, හෝ භාණ්ඩයේ / මිල ටැගයේ ඡායාරූපයක් එක් කරන්න." },
  },
  {
    path: "/add",
    match: ADD,
    target: "add-save",
    en: { title: "5. Save", body: "Tap “Save price”. The shop stays selected, so you can add the next item right away." },
    si: { title: "5. Save කරන්න", body: "“Save price” ඔබන්න. ඊළඟ භාණ්ඩය වහාම දාන්න පුළුවන් විදියට කඩය තෝරාගෙනම තිබේ." },
  },
  {
    path: "/tour/item",
    match: ITEM,
    target: "item-summary",
    en: { title: "An item's page", body: "Best cost = cheapest price per piece. Sell at = your selling price. Profit / pc = what you make on each piece." },
    si: { title: "භාණ්ඩයක පිටුව", body: "Best cost = එක කෑල්ලක අඩුම මිල. Sell at = ඔබ විකුණන මිල. Profit / pc = එක කෑල්ලකින් ලැබෙන ලාභය." },
  },
  {
    path: "/tour/item",
    match: ITEM,
    target: "item-actions",
    en: { title: "Add price & Buy list", body: "“+ Add price” opens the form with this item already picked. “+ Buy list” adds it to your shopping list." },
    si: { title: "මිල සහ ගන්න ලැයිස්තුව", body: "“+ Add price” මෙම භාණ්ඩය තෝරාගෙනම මිල දාන්න විවෘත කරයි. “+ Buy list” එය මිලදී ගන්න ලැයිස්තුවට එක් කරයි." },
  },
  {
    path: "/tour/item",
    match: ITEM,
    target: "item-newshop",
    en: { title: "Found it at another shop?", body: "Tap here when you find this item at a shop that's not in the list yet." },
    si: { title: "වෙනත් කඩයක හමු වුණාද?", body: "ලැයිස්තුවේ නැති කඩයක මෙම භාණ්ඩය හමු වුණොත් මෙතන ඔබන්න." },
  },
  {
    path: "/tour/item",
    match: ITEM,
    target: "item-offers",
    en: { title: "Prices by shop", body: "Every shop's latest price, cheapest first. ★ = cheapest. The others show how much more they cost. ▲ ▼ = the price went up or down since last time." },
    si: { title: "කඩ අනුව මිල", body: "සෑම කඩයකම අලුත්ම මිල, අඩුම එක උඩින්. ★ = අඩුම. අනෙක් ඒවා කොපමණ වැඩිද පෙන්වයි. ▲ ▼ = පසුගිය වතාවට වඩා මිල වැඩි හෝ අඩු වී ඇත." },
  },
  {
    path: "/tour/item",
    match: ITEM,
    target: "item-retail",
    en: { title: "Your selling price", body: "Type what you'll sell it for and tap Save to see your profit and margin. Not sure? Tap a suggestion like “40%”." },
    si: { title: "ඔබ විකුණන මිල", body: "ඔබ විකුණන මිල ටයිප් කර Save ඔබන්න. ලාභය සහ ප්‍රතිශතය පෙන්වයි. විශ්වාස නැත්නම් “40%” වැනි යෝජනාවක් ඔබන්න." },
  },
  {
    path: "/shops",
    match: SHOPS,
    target: "shops-new",
    en: { title: "Shops screen", body: "All shops, grouped by street. Add a shop with its phone number, address and a photo of the shop front here." },
    si: { title: "Shops තිරය", body: "සියලු කඩ වීදිය අනුව. දුරකථන අංකය, ලිපිනය සහ කඩයේ ඡායාරූපයක් සමඟ අලුත් කඩයක් මෙතනින් එක් කරන්න." },
  },
  {
    path: "/shops",
    match: SHOPS,
    target: "shop-card",
    en: { title: "A shop", body: "Shows how many items there still need a price. Tap a shop to open it." },
    si: { title: "කඩයක්", body: "එම කඩයේ තවම මිල බලන්න ඉතිරි භාණ්ඩ ගණන පෙන්වයි. විවෘත කිරීමට ඔබන්න." },
  },
  {
    path: "/tour/shop",
    match: SHOP,
    target: "shop-actions",
    en: { title: "Inside a shop", body: "“+ Add price here” opens the form with this shop already picked. “Call” and “Map” appear once you've saved a phone number or address." },
    si: { title: "කඩයක් ඇතුළත", body: "“+ Add price here” මෙම කඩය තෝරාගෙනම මිල දාන්න විවෘත කරයි. දුරකථන අංකයක් හෝ ලිපිනයක් ඇත්නම් “Call” සහ “Map” පෙන්වයි." },
  },
  {
    path: "/tour/shop",
    match: SHOP,
    target: "shop-items",
    en: { title: "What to check here", body: "Use this list while standing in the shop: tap “Price” next to each item. Prices already recorded here show whether each one is the cheapest." },
    si: { title: "මෙහි බලන්න ඕන දේ", body: "කඩය ඇතුළේ සිටියදී මෙම ලැයිස්තුව භාවිතා කරන්න: එක් එක් භාණ්ඩය අසල “Price” ඔබන්න. මෙහි දැනටමත් දැමූ මිල අඩුමද නැද්ද කියාත් පෙන්වයි." },
  },
  {
    path: "/list",
    match: LIST,
    target: "list-main",
    en: { title: "Buy list", body: "Items you plan to buy, grouped by their cheapest shop, with the cash you need and the expected profit. Tick items as you buy them." },
    si: { title: "ගන්න ලැයිස්තුව", body: "ඔබ ගන්න සැලසුම් කරන භාණ්ඩ, අඩුම මිල ඇති කඩය අනුව. ගෙනියන්න ඕන මුදල සහ ලාභය පෙන්වයි. ගත් භාණ්ඩ ටික් කරන්න." },
  },
  {
    path: "/list",
    match: LIST,
    target: "nav-help",
    en: { title: "That's it!", body: "Replay this tour, or read the full guide in English or Sinhala, from Help anytime." },
    si: { title: "එච්චරයි!", body: "මෙම චාරිකාව නැවත බැලීමට, නැත්නම් සම්පූර්ණ උපදෙස් කියවීමට, ඕනෑම වෙලාවක Help ඔබන්න." },
  },
];

export const TOUR_UI = {
  en: { next: "Next", back: "Back", finish: "Finish", skip: "Exit tour", loading: "Opening…" },
  si: { next: "ඊළඟ", back: "ආපසු", finish: "අවසන්", skip: "නවත්වන්න", loading: "විවෘත වෙමින්…" },
};
