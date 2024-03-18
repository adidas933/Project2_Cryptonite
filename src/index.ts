// PROBLEMS:
// when clicking the more info button the data comes before the button and the button is in the bottom how to change this?
// Classes:

class Coins {
  id: string;
  symbol: string;
  name: string;
  constructor(id: string, symbol: string, name: string) {
    this.id = id;
    this.symbol = symbol;
    this.name = name;
  }
}

class Coin {
  name: string;
  id: string;
  image: CoinImage;
  market_data: MarketData;
  constructor(
    name: string,
    id: string,
    image: CoinImage,
    market_data: MarketData
  ) {
    this.name = name;
    this.id = id;
    this.image = image;
    this.market_data = market_data;
  }
}

class MarketData {
  current_price: CurrentPrice;
  constructor(current_price: CurrentPrice) {
    this.current_price = current_price;
  }
}

class CurrentPrice {
  usd: number;
  eur: number;
  ils: number;
  constructor(usd: number, eur: number, ils: number) {
    this.usd = usd;
    this.eur = eur;
    this.ils = ils;
  }
}

class CoinImage {
  thumb: string;
  constructor(thumb: string) {
    this.thumb = thumb;
  }
}

// Variables:
const cardsDiv: JQuery<HTMLElement> = $('.cardsDiv');
const moreInfoBtn: JQuery<HTMLElement> = $('.moreInfoBtn');
const searchBtn: JQuery<HTMLElement> = $('.searchBtn');
const searchInput: JQuery<HTMLElement> = $('.searchInput');
const aboutBtn: JQuery<HTMLElement> = $('.aboutBtn');
const liveReportsBtn: JQuery<HTMLElement> = $('.liveReportsBtn');
const homeBtn: JQuery<HTMLElement> = $('.homeBtn');
const arrayOfCoins: Coin[] = [];
const navbar: JQuery<HTMLElement> = $('.navbar');
const spinner: JQuery<HTMLElement> = $('.spinner');

// Functions:
$(async function getCrypto(): Promise<void> {
  if (!localStorage['coins']) {
    spinner.removeClass('visually-hidden');
    const coins: Coins[] = await fetchCoins();
    localStorage['coins'] = JSON.stringify(coins);
    createCard(coins);
    spinner.addClass('visually-hidden');
  } else {
    const coinFromStorage: Coins[] =
      JSON.parse(localStorage['coins']) || undefined;
    createCard(coinFromStorage);
  }
});

async function fetchCoins(): Promise<Coins[]> {
  const responseCoins = await fetch(
    'https://api.coingecko.com/api/v3/coins/list'
  );
  const oneHundredCoins = [];
  const coins = await responseCoins.json();
  for (let i = 0; i < 100; i++) {
    oneHundredCoins.push(coins[i]);
  }
  return oneHundredCoins;
}

function createCard(coins: Coins[]): void {
  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i];
    const cardDiv = createCardDiv();
    const cardBody = createCardBody(cardDiv);
    const cardHeader = createCardHeader(cardBody);
    CreateFavoriteBtn(cardHeader);
    displayCoinSymbol(cardHeader, coin);
    displayCoinName(cardBody, coin);
    createMoreInfoBtn(cardBody, coin);
    const moreInfoDiv = createMoreInfoDiv(cardBody, coin);
    createSpinnerInCard(moreInfoDiv);
    cardsDiv.append(cardDiv);
    moreInfo2(coin.id);
  }
}

// card content functions:
function createCardDiv(): JQuery<HTMLElement> {
  const cardDiv = $('<div>');
  cardDiv.addClass('card col-md-4 text-center m-1 text-bg-secondary');
  cardDiv.css('width', '16rem');

  return cardDiv;
}

function createCardBody(cardDiv: JQuery<HTMLElement>): JQuery<HTMLElement> {
  const cardBody = $('<div>');
  cardBody.addClass('card-body p-0');
  cardDiv.append(cardBody);
  return cardBody;
}

function createCardHeader(cardBody: JQuery<HTMLElement>): JQuery<HTMLElement> {
  const cardHeader = $('<div>');
  cardHeader.addClass('cardHeadingAndCheckBox d-flex mb-3');
  cardBody.append(cardHeader);
  return cardHeader;
}

function CreateFavoriteBtn(
  cardHeader: JQuery<HTMLElement>
): JQuery<HTMLElement> {
  const favoriteBtnDiv = $('<div>');
  favoriteBtnDiv.addClass('favoriteBtnDiv form-check form-switch col-6');
  cardHeader.append(favoriteBtnDiv);
  const favoriteBtn = $('<input>');
  favoriteBtn.addClass('form-check-input favoriteBtn text-success');
  favoriteBtn.attr('id', 'flexSwitchCheckDefault');
  favoriteBtn.attr('type', 'checkbox');
  favoriteBtn.attr('role', 'switch');
  favoriteBtnDiv.append(favoriteBtn);
  return favoriteBtn;
}

function displayCoinSymbol(
  cardHeadingAndCheckBox: JQuery<HTMLElement>,
  coin: Coins
): JQuery<HTMLElement> {
  const coinSymbol = $('<h5>');
  coinSymbol.addClass('position-absolute');
  coinSymbol.html(coin.symbol.toUpperCase());
  cardHeadingAndCheckBox.append(coinSymbol);
  return coinSymbol;
}

function displayCoinName(
  cardBody: JQuery<HTMLElement>,
  coin: Coins
): JQuery<HTMLElement> {
  const coinNameDiv = $('<div>');
  coinNameDiv.addClass('mb-5 w-100');
  cardBody.append(coinNameDiv);
  const coinName = $('<h5>');
  coinName.addClass('card-Name col-6 w-100');
  coinName.html(coin.name);
  coinNameDiv.append(coinName);
  return coinName;
}

function createMoreInfoBtn(
  cardBody: JQuery<HTMLElement>,
  coin: Coins
): JQuery<HTMLElement> {
  const moreInfoBtn = $('<a>');
  moreInfoBtn.addClass(
    'moreInfoBtn btn btn-outline-warning my-3 mx-auto d-flex align-items-center justify-content-center col-12 w-50'
  );
  moreInfoBtn.attr('id', `moreInfoBtn${coin.id}`);
  moreInfoBtn.html('More Info');
  cardBody.append(moreInfoBtn);
  return moreInfoBtn;
}

function createMoreInfoDiv(
  cardBody: JQuery<HTMLElement>,
  coin: Coins
): JQuery<HTMLElement> {
  const moreInfoDiv = $('<div>');
  moreInfoDiv.addClass('currencies text-center');
  moreInfoDiv.attr('id', `moreInfoDiv${coin.id}`);
  cardBody.append(moreInfoDiv);
  return moreInfoDiv;
}

function createSpinnerInCard(moreInfoDiv: JQuery<HTMLElement>): JQuery<HTMLElement> {
  const spinnerDiv = $('<div>');
  spinnerDiv.addClass('d-flex justify-content-center align-items-center');
  const spinner = $('<div>');
  spinner.addClass(`spinner spinner-border text-warning visually-hidden`);
  spinner.attr('role', `status`);
  spinnerDiv.append(spinner);
  const span = $('<span>');
  span.addClass('visually-hidden');
  spinner.append(span);
  moreInfoDiv.append(spinnerDiv);
  return spinnerDiv;
}

function findSearchedCoins() {
  const coins: Coins[] = JSON.parse(localStorage['coins'] || []);
  const searchInputValue = searchInput.val() as string;
  const filteredCoins = coins.filter(
    (coin: Coins) =>
      coin.symbol.toLowerCase() === (searchInputValue?.toLowerCase() || '')
  );
  cardsDiv.empty();
  createCard(filteredCoins);
}

function moreInfoContent(coin: Coin): string {
  const moreInfo = `<img src="${coin.image.thumb}">
    <p class="card-text m-0">${coin.market_data.current_price.usd} $</p>
    <p class="card-text m-0">${coin.market_data.current_price.eur} €</p>
    <p class="card-text mb-5">${coin.market_data.current_price.ils} ₪</p>`;
  return moreInfo;
}

async function fetchCoin(coinId: string): Promise<Coin> {
  const responseCoin = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}`
  );
  // returns coin info
  return await responseCoin.json();
}
async function moreInfo2(coinId: string): Promise<void> {
  const moreInfoBtn = $(`#moreInfoBtn${coinId}`);
  const moreInfoSpecific = $(`#moreInfoDiv${coinId}`);
  moreInfoBtn.on('click', async function () {
    await toggleMoreInfo(moreInfoSpecific, coinId);
  });
}

async function toggleMoreInfo(
  moreInfoSpecific: JQuery<HTMLElement>,
  coinId: string
): Promise<void> {
  spinner.removeClass('visually-hidden');
  spinner.addClass('fixed-bottom');

  const coinInfoFromStorage = JSON.parse(localStorage['coinInfo'] || '{}');
  // if coin not in storage:
  if (!coinInfoFromStorage[coinId]) {
    // the coin fetched and injected to storage
    const coinFetched: Coin = await fetchCoin(coinId);
    coinInfoFromStorage[coinId] = coinFetched;
    localStorage['coinInfo'] = JSON.stringify(coinInfoFromStorage);
    const getMoreInfoContent: string = moreInfoContent(coinFetched);

    if (moreInfoSpecific.html()) {
      moreInfoSpecific.slideUp(300);
      moreInfoSpecific.html('');
    } else {
      moreInfoSpecific.html(getMoreInfoContent).hide().slideDown(300);
    }
  } else {
    const coinFetched: Coin = coinInfoFromStorage[coinId];
    const getMoreInfoContent = moreInfoContent(coinFetched);

    if (moreInfoSpecific.html()) {
      moreInfoSpecific.slideUp(300);
      moreInfoSpecific.html('');
    } else {
      moreInfoSpecific.html(getMoreInfoContent).hide().slideDown(300);
    }
  }
  spinner.addClass('visually-hidden');
}

function aboutPage() {
  cardsDiv.html('');
  cardsDiv.html(
    `About Page: Adi Vanunu Cryptonite image of me:... personal info:... project description: ...`
  );
}

function liveReports() {
  cardsDiv.html('');
  cardsDiv.html(`Live Reports`);
}

function homePage() {
  cardsDiv.html(`changes back to home page`);
}

// Event listeners:
searchBtn.on('click', findSearchedCoins);
aboutBtn.on('click', aboutPage);
liveReportsBtn.on('click', liveReports);
homeBtn.on('click', homePage);
