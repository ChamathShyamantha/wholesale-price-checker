// Tutorial content in English and Sinhala.
// Button names stay in English in both languages, because that's how they appear in the app.

import type { Lang } from "./lang";
export type { Lang };

export type Section = {
  id: string;
  icon: string;
  title: string;
  steps: string[];
  link?: { href: string; label: string };
};

type Content = {
  pageTitle: string;
  intro: string;
  start: string;
  tour: string;
  tourHint: string;
  next: string;
  back: string;
  finish: string;
  stepOf: (n: number, total: number) => string;
  allSections: string;
  note: string;
  sections: Section[];
};

export const TUTORIAL: Record<Lang, Content> = {
  en: {
    pageTitle: "How to use",
    intro: "Take the guided tour on the real screens, or read the guide below.",
    start: "Read the guide step by step",
    tour: "Show me around (guided tour)",
    tourHint: "Opens each screen and points to exactly what to tap.",
    next: "Next",
    back: "Back",
    finish: "Finish",
    stepOf: (n, t) => `Step ${n} of ${t}`,
    allSections: "All sections",
    note: "Button names are shown in English, the same as in the app.",
    sections: [
      {
        id: "welcome",
        icon: "👋",
        title: "What this app does",
        steps: [
          "Record the wholesale price each shop in Pettah gives you.",
          "The app shows which shop is cheapest for every item, automatically.",
          "When you set your selling (retail) price, it works out your profit per piece and your margin.",
          "The 5 buttons at the bottom: Items, Shops, Add price, Buy list and Help (this guide).",
        ],
      },
      {
        id: "items",
        icon: "📋",
        title: "Items screen",
        steps: [
          "Every item is listed here.",
          "Green price = the cheapest price per piece, and the shop that has it.",
          "Orange “Not checked yet” = no shop has been priced for this item yet.",
          "Type in the search box to find an item.",
          "“To check” shows items still waiting for a price. “Priced” shows the ones done. “No retail price” shows items you haven't set a selling price for.",
          "Tap the street you're walking (for example 2nd Cross St). The app remembers it next time.",
          "You can also filter by type (Bags, Makeup…).",
        ],
        link: { href: "/", label: "Open Items" },
      },
      {
        id: "add",
        icon: "➕",
        title: "Add a price",
        steps: [
          "Tap the green “+ Add price” button at the bottom.",
          "Shop: type the shop name and pick it. It stays selected for the next item, so you can price many items at one shop quickly.",
          "Item: search for the item and pick it.",
          "Type the wholesale price the shop gives you.",
          "If the price is for 12 pieces, tap “Dozen”, or type the number of pieces. The app works out the price per piece.",
          "Tap “Save price”. You'll see “✓ Saved”.",
          "Optional: tap “+ MOQ, note, photo” to add a minimum order, a note, or a photo of the price tag.",
        ],
        link: { href: "/add", label: "Open Add price" },
      },
      {
        id: "compare",
        icon: "⚖️",
        title: "Where is it cheapest?",
        steps: [
          "While you type a price, the app compares it with the best price you already have.",
          "Orange box = another shop is cheaper (for example “Thaika Plaza is cheaper”).",
          "Green box = “New best price!”. This shop is now the cheapest.",
          "Prices are compared per piece, so a dozen price and a single-piece price compare correctly.",
          "Tap any item to see all shops' prices, from cheapest to most expensive.",
        ],
      },
      {
        id: "newshop",
        icon: "🏪",
        title: "New shop or new item",
        steps: [
          "Found the item at a shop that's not in the list? On Add price, tap “+ New shop” next to Shop.",
          "Type the shop name and street, pick the item, enter the price and save. The new shop is linked to the item automatically.",
          "You can also use “Found it at a shop that's not in the list? + New shop” on an item's page.",
          "For an item that's not in the list, tap “+ New item” next to Item, and give it a name and type.",
          "On the Shops screen, “+ New shop” lets you add a shop with its phone number and address.",
        ],
      },
      {
        id: "itempage",
        icon: "🔍",
        title: "An item's page",
        steps: [
          "Tap an item in the Items list.",
          "At the top: Best cost (cheapest price), Sell at (your selling price), Profit / pc (profit per piece).",
          "Prices by shop: ★ and green = cheapest. The others show how much more they cost, like “+Rs 25 vs best”.",
          "▲ / ▼ = the price went up or down since the last time you checked that shop.",
          "“Still to check” = shops known to sell this item that you haven't priced yet. Tap “Add price” to price it directly.",
          "“Price history” = every price ever entered. Entered a wrong price? Tap ✕ to delete it.",
          "“Edit item details” changes the name, type, usual pack size, notes and photo.",
        ],
      },
      {
        id: "retail",
        icon: "💰",
        title: "Selling price and profit",
        steps: [
          "On an item's page, type your selling price in “Retail price” and tap “Save”.",
          "You'll see the profit per piece and the margin %. If you'd lose money, it shows in red.",
          "Not sure what to charge? Tap a suggestion like “40% → Rs 170”.",
          "You can set selling prices later. Everything else works without them.",
        ],
      },
      {
        id: "shops",
        icon: "🏬",
        title: "Shops screen",
        steps: [
          "Shops are grouped by street. “to check” = how many items at that shop still need a price.",
          "Tap a shop. Use the “To check here” list while you're standing in the shop: tap “Price” next to each item.",
          "“Prices here” shows this shop's prices and whether each one is the cheapest.",
          "“Call” and “Map” buttons appear when the shop has a phone number or address.",
          "“Edit shop details” adds a phone number, Google Maps link and notes (opening hours, bargaining…).",
        ],
        link: { href: "/shops", label: "Open Shops" },
      },
      {
        id: "list",
        icon: "🛒",
        title: "Buy list",
        steps: [
          "On an item's page, tap “+ Buy list” and set the quantity (pieces) with − and +.",
          "The Buy list groups items by the cheapest shop, so you know where to go.",
          "At the top: Cash needed (money to bring), Sells for (what it will sell for) and Profit.",
          "Tick the box when you've bought an item. When done, tap “Clear bought”.",
        ],
        link: { href: "/list", label: "Open Buy list" },
      },
      {
        id: "export",
        icon: "📊",
        title: "Get it in Excel",
        steps: [
          "On the Items screen, tap “Export CSV” at the top.",
          "Open the downloaded file in Excel or Google Sheets. It has every shop, price, price per piece, profit, and which shop is cheapest.",
        ],
      },
      {
        id: "phone",
        icon: "📱",
        title: "Put it on your phone",
        steps: [
          "Android (Chrome): tap ⋮ → “Add to Home screen”.",
          "iPhone (Safari): tap Share → “Add to Home Screen”.",
          "It then opens like a normal app. You enter the password once per phone.",
          "Saving a price needs internet.",
        ],
      },
      {
        id: "tips",
        icon: "💡",
        title: "Tips",
        steps: [
          "A shop changed its price? Just add the new price. The app uses the newest one, and the old one stays in Price history.",
          "Lots of items at one shop? Pick the shop once, then only change the item and price before each Save.",
          "Working with a partner? Use the same link and password, and you'll both see the same data.",
        ],
      },
    ],
  },
  si: {
    pageTitle: "භාවිතා කරන ආකාරය",
    intro: "සැබෑ තිර මත මඟ පෙන්වන චාරිකාව බලන්න, නැත්නම් පහත උපදෙස් කියවන්න.",
    start: "උපදෙස් පියවරෙන් පියවර කියවන්න",
    tour: "ඇප් එක පෙන්වන්න (මඟ පෙන්වන චාරිකාව)",
    tourHint: "සෑම තිරයක්ම විවෘත කර, ඔබන්න ඕන තැනම පෙන්වයි.",
    next: "ඊළඟ",
    back: "ආපසු",
    finish: "අවසන්",
    stepOf: (n, t) => `පියවර ${n} / ${t}`,
    allSections: "සියලු කොටස්",
    note: "බොත්තම්වල නම් ඇප් එකේ තිබෙන ආකාරයටම ඉංග්‍රීසියෙන් දක්වා ඇත.",
    sections: [
      {
        id: "welcome",
        icon: "👋",
        title: "මෙම ඇප් එක කරන්නේ මොකද්ද?",
        steps: [
          "පිටකොටුවේ එක් එක් කඩයේ තොග (wholesale) මිල මෙහි සටහන් කරන්න.",
          "එක් එක් භාණ්ඩය අඩුම මිලට ලැබෙන කඩය ඇප් එක ස්වයංක්‍රීයව පෙන්වයි.",
          "ඔබ විකුණන (retail) මිල දැම්මාම, එක කෑල්ලකින් ලැබෙන ලාභය සහ ලාභ ප්‍රතිශතය ගණනය කරයි.",
          "පහළ බොත්තම් 5: Items (භාණ්ඩ), Shops (කඩ), Add price (මිලක් දැමීම), Buy list (ගන්න ලැයිස්තුව), Help (මෙම උපදෙස්).",
        ],
      },
      {
        id: "items",
        icon: "📋",
        title: "Items තිරය",
        steps: [
          "සියලුම භාණ්ඩ මෙහි ලැයිස්තුගත වේ.",
          "කොළ පාට මිල = එක කෑල්ලක අඩුම මිල සහ එය ලැබෙන කඩය.",
          "තැඹිලි පාට “Not checked yet” = තවම කිසිම කඩයක මිල දාලා නැහැ.",
          "සෙවුම් කොටුවේ නම ටයිප් කර භාණ්ඩයක් සොයන්න.",
          "“To check” = තවම මිල බලන්න ඉතිරි භාණ්ඩ. “Priced” = මිල දැමූ ඒවා. “No retail price” = විකුණන මිල තවම නොදැමූ ඒවා.",
          "ඔබ ඇවිදින වීදිය (උදා: 2nd Cross St) ඔබන්න. ඊළඟ වතාවේත් ඇප් එක එය මතක තබා ගනී.",
          "වර්ගය අනුවත් (Bags, Makeup…) පෙරහන් කළ හැක.",
        ],
        link: { href: "/", label: "Items විවෘත කරන්න" },
      },
      {
        id: "add",
        icon: "➕",
        title: "මිලක් දැමීම",
        steps: [
          "පහළ ඇති කොළ පාට “+ Add price” බොත්තම ඔබන්න.",
          "Shop: කඩයේ නම ටයිප් කර තෝරන්න. ඊළඟ භාණ්ඩයටත් එම කඩයම තෝරාගෙනම තිබේ, ඒ නිසා එකම කඩයේ භාණ්ඩ ගොඩක් ඉක්මනින් දාන්න පුළුවන්.",
          "Item: භාණ්ඩය සොයා තෝරන්න.",
          "කඩේ කියන තොග මිල ටයිප් කරන්න.",
          "මිල කෑලි 12කට (ඩසනකට) නම් “Dozen” ඔබන්න, නැත්නම් කෑලි ගණන ටයිප් කරන්න. ඇප් එක එක කෑල්ලක මිල ගණනය කරයි.",
          "“Save price” ඔබන්න. “✓ Saved” පෙන්වයි.",
          "අවශ්‍ය නම් “+ MOQ, note, photo” ඔබා අවම ඇණවුම, සටහනක් හෝ මිල ටැගයේ ඡායාරූපයක් එක් කරන්න.",
        ],
        link: { href: "/add", label: "Add price විවෘත කරන්න" },
      },
      {
        id: "compare",
        icon: "⚖️",
        title: "අඩුම මිල කොහෙද?",
        steps: [
          "මිල ටයිප් කරන විටම, දැනට ඇති අඩුම මිල සමඟ ඇප් එක සසඳයි.",
          "තැඹිලි කොටුව = වෙනත් කඩයක අඩුවට තියෙනවා (උදා: “Thaika Plaza is cheaper”).",
          "කොළ කොටුව = “New best price!”. දැන් මේ කඩය තමයි අඩුම.",
          "සැසඳීම එක කෑල්ලක මිල අනුව නිසා, ඩසන් මිලක් සහ තනි කෑලි මිලක් වුවත් නිවැරදිව සසඳයි.",
          "ඕනෑම භාණ්ඩයක් ඔබා බැලුවොත්, සියලු කඩවල මිල අඩුම සිට වැඩිම දක්වා පෙළගැසී ඇත.",
        ],
      },
      {
        id: "newshop",
        icon: "🏪",
        title: "අලුත් කඩයක් හෝ අලුත් භාණ්ඩයක්",
        steps: [
          "ලැයිස්තුවේ නැති කඩයක භාණ්ඩය හමු වුණාද? Add price තිරයේ Shop අසල ඇති “+ New shop” ඔබන්න.",
          "කඩයේ නම සහ වීදිය ටයිප් කර, භාණ්ඩය තෝරා, මිල දමා Save කරන්න. අලුත් කඩය ස්වයංක්‍රීයව එම භාණ්ඩයට සම්බන්ධ වේ.",
          "භාණ්ඩයේ පිටුවේ ඇති “Found it at a shop that's not in the list? + New shop” බොත්තමෙනුත් මෙය කළ හැක.",
          "ලැයිස්තුවේ නැති භාණ්ඩයක් නම්, Item අසල ඇති “+ New item” ඔබා නම සහ වර්ගය දෙන්න.",
          "Shops තිරයේ “+ New shop” මගින් දුරකථන අංකය, ලිපිනය සමඟ කඩයක් එක් කළ හැක.",
        ],
      },
      {
        id: "itempage",
        icon: "🔍",
        title: "භාණ්ඩයක පිටුව",
        steps: [
          "Items ලැයිස්තුවේ භාණ්ඩයක් ඔබන්න.",
          "උඩින්: Best cost (අඩුම මිල), Sell at (ඔබ විකුණන මිල), Profit / pc (එක කෑල්ලක ලාභය).",
          "Prices by shop: ★ සහ කොළ පාට = අඩුම මිල. අනෙක් ඒවා “+Rs 25 vs best” ලෙස කොපමණ වැඩිද පෙන්වයි.",
          "▲ / ▼ = පසුගිය වතාවට වඩා එම කඩයේ මිල වැඩි වී හෝ අඩු වී ඇත.",
          "“Still to check” = මෙම භාණ්ඩය ඇති බව දන්නා නමුත් තවම මිල නොබැලූ කඩ. “Add price” ඔබා කෙලින්ම මිල දාන්න.",
          "“Price history” = දාපු සියලු මිල. වැරදි මිලක් දැම්මොත් ✕ ඔබා මකන්න.",
          "“Edit item details” මගින් නම, වර්ගය, සාමාන්‍ය පැකට් ප්‍රමාණය, සටහන් සහ ඡායාරූපය වෙනස් කරන්න.",
        ],
      },
      {
        id: "retail",
        icon: "💰",
        title: "විකුණන මිල සහ ලාභය",
        steps: [
          "භාණ්ඩයේ පිටුවේ “Retail price” කොටුවට ඔබ විකුණන මිල ටයිප් කර “Save” ඔබන්න.",
          "එක කෑල්ලක ලාභය සහ ලාභ ප්‍රතිශතය පෙන්වයි. පාඩුවක් නම් රතු පාටින් පෙන්වයි.",
          "මිල තීරණය කරන්න අමාරු නම්, “40% → Rs 170” වැනි යෝජනාවක් ඔබන්න.",
          "විකුණන මිල පසුවත් දැමිය හැක. ඒවා නැතුවත් අනෙක් සියල්ල වැඩ කරයි.",
        ],
      },
      {
        id: "shops",
        icon: "🏬",
        title: "Shops තිරය",
        steps: [
          "කඩ වීදිය අනුව කාණ්ඩ කර ඇත. “to check” = එම කඩයේ තවම මිල බලන්න ඉතිරි භාණ්ඩ ගණන.",
          "කඩයක් ඔබන්න. කඩය ඇතුළේ සිටියදී “To check here” ලැයිස්තුව භාවිතා කරන්න: එක් එක් භාණ්ඩය අසල “Price” ඔබන්න.",
          "“Prices here” = මේ කඩයේ මිල, සහ එය අඩුම මිලද නැද්ද යන්න.",
          "කඩයට දුරකථන අංකයක් හෝ ලිපිනයක් ඇත්නම් “Call” සහ “Map” බොත්තම් පෙන්වයි.",
          "“Edit shop details” මගින් දුරකථන අංකය, Google Maps ලින්ක් එක සහ සටහන් (විවෘත වේලාවන්, ගණන් කතා කිරීම…) එක් කරන්න.",
        ],
        link: { href: "/shops", label: "Shops විවෘත කරන්න" },
      },
      {
        id: "list",
        icon: "🛒",
        title: "Buy list (ගන්න ලැයිස්තුව)",
        steps: [
          "භාණ්ඩයේ පිටුවේ “+ Buy list” ඔබා, − සහ + මගින් ප්‍රමාණය (කෑලි ගණන) සකසන්න.",
          "Buy list එක භාණ්ඩ අඩුම මිලට ලැබෙන කඩය අනුව කාණ්ඩ කරයි, ඒ නිසා යන්න ඕන කඩ පේනවා.",
          "උඩින්: Cash needed (ගෙනියන්න ඕන මුදල), Sells for (විකුණුම් වටිනාකම), Profit (ලාභය).",
          "මිලදී ගත් භාණ්ඩයේ කොටුව ටික් කරන්න. අවසානයේ “Clear bought” ඔබන්න.",
        ],
        link: { href: "/list", label: "Buy list විවෘත කරන්න" },
      },
      {
        id: "export",
        icon: "📊",
        title: "Excel වලට ගැනීම",
        steps: [
          "Items තිරයේ උඩ ඇති “Export CSV” ඔබන්න.",
          "බාගත වන ගොනුව Excel හෝ Google Sheets වලින් විවෘත කරන්න. සියලු කඩ, මිල, එක කෑල්ලක මිල, ලාභය සහ අඩුම මිල ඇති කඩය එහි ඇත.",
        ],
      },
      {
        id: "phone",
        icon: "📱",
        title: "දුරකථනයට දාගන්න",
        steps: [
          "Android (Chrome): ⋮ ඔබා → “Add to Home screen”.",
          "iPhone (Safari): Share ඔබා → “Add to Home Screen”.",
          "එවිට සාමාන්‍ය ඇප් එකක් මෙන් විවෘත වේ. මුරපදය (password) එක් දුරකථනයකට එක් වරක් පමණක් දැමිය යුතුය.",
          "මිලක් Save කිරීමට අන්තර්ජාලය අවශ්‍යයි.",
        ],
      },
      {
        id: "tips",
        icon: "💡",
        title: "ප්‍රයෝජනවත් ඉඟි",
        steps: [
          "කඩයක මිල වෙනස් වුණාද? අලුත් මිල නැවත දාන්න. ඇප් එක අලුත්ම මිල ගනී, පරණ මිල Price history හි තිබේ.",
          "එකම කඩයේ භාණ්ඩ ගොඩක්ද? කඩය එක වරක් තෝරා, Save කරන්න කලින් භාණ්ඩය සහ මිල පමණක් වෙනස් කරන්න.",
          "හවුල්කරුවෙක් සමඟද? දෙදෙනාම එකම ලින්ක් එක සහ මුරපදය භාවිතා කළ විට, දෙදෙනාටම එකම දත්ත පෙනේ.",
        ],
      },
    ],
  },
};
