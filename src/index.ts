// PROBLEMS:
// when i click the more info button it wont work the first time
// when I click the more info button the first time - I get the right info on the coin card button I clicked. after that when I click another coind more info button I get the first coin info. maybe something with the local storage that needs an if statement...
// when page is loaded it brings me to the top of page.

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
const cardsContainer: JQuery<HTMLElement> = $('.cardsContainer');
const moreInfoBtn: JQuery<HTMLElement> = $('.moreInfoBtn');
const searchBtn: JQuery<HTMLElement> = $('.searchBtn');
const searchInput: JQuery<HTMLElement> = $('.searchInput');
const arrayOfCoins: Coin[] = [];

// Functions:

$(window).on('unload', function () {
  $(window).scrollTop(0);
});

function sortCoins() {
  const coins: Coins[] = JSON.parse(localStorage['coins'] || []);
  const searchInputValue = searchInput.val() as string;
  const filteredCoins = coins.filter(
    (coin: Coins) =>
      coin.symbol.toLowerCase() === (searchInputValue?.toLowerCase() || '')
  );
  cardsContainer.empty();
  createCard(filteredCoins);
}

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

function moreInfoContent(coin: Coin): string {
  const moreInfo = `<img src="${coin.image.thumb}">
  <p class="card-text m-0">${coin.id} = ${coin.market_data.current_price.usd} $</p>
  <p class="card-text m-0">${coin.id} = ${coin.market_data.current_price.eur} €</p>
  <p class="card-text mb-5">${coin.id} = ${coin.market_data.current_price.ils} ₪</p>`;
  return moreInfo;
}

async function fetchCoin(coinId: string): Promise<Coin> {
  const responseCoin = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}`
  );
  // returns coin info
  return await responseCoin.json();
}

$(async function getCrypto(): Promise<void> {
  if (!localStorage['coins']) {
    // 100 coins:
    const coins: Coins[] = await fetchCoins();
    localStorage['coins'] = JSON.stringify(coins);
    createCard(coins);
  } else {
    const coinFromStorage: Coins[] =
      JSON.parse(localStorage['coins']) || undefined;
    createCard(coinFromStorage);
  }
});
// make small functions:
function createCard(coins: Coins[]): void {
  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i];

    const cardContainer = $('<div>');
    cardContainer.addClass('card col-md-4 text-center m-1');
    cardContainer.css('width', '16rem');

    const cardBody = $('<div>');
    cardBody.addClass('card-body p-0');
    cardContainer.append(cardBody);

    const cardHeadingAndCheckBox = $('<div>');
    cardHeadingAndCheckBox.addClass('cardHeadingAndCheckBox d-flex mb-3');
    cardBody.append(cardHeadingAndCheckBox);

    const toggleButtonContainer = $('<div>');
    toggleButtonContainer.addClass(
      'toggleButtonContainer form-check form-switch col-6'
    );
    cardHeadingAndCheckBox.append(toggleButtonContainer);

    const toggleButtonInput = $('<input>');
    toggleButtonInput.addClass('form-check-input');
    toggleButtonInput.attr('id', 'flexSwitchCheckDefault');
    toggleButtonInput.attr('type', 'checkbox');
    toggleButtonInput.attr('role', 'switch');
    toggleButtonContainer.append(toggleButtonInput);

    const coinSymbol = $('<h5>');
    coinSymbol.addClass('position-absolute');
    coinSymbol.html(coin.symbol.toUpperCase());
    cardHeadingAndCheckBox.append(coinSymbol);

    const coinNameDiv = $('<div>');
    coinNameDiv.addClass('mb-5 w-100');
    cardBody.append(coinNameDiv);

    const coinName = $('<h5>');
    coinName.addClass('card-Name col-6 w-100');
    coinName.html(coin.name);
    coinNameDiv.append(coinName);

    const moreInfoBtn = $('<a>');
    moreInfoBtn.addClass(
      'moreInfoBtn btn btn-primary position-absolute bottom-0 translate-middle-x mt-3'
    );
    // moreInfoBtn.attr('href', '#');
    moreInfoBtn.attr('id', `moreInfo_btn${coin.id}`);
    moreInfoBtn.html('More Info');
    cardBody.append(moreInfoBtn);

    const moreInfoContainer = $('<div>');
    moreInfoContainer.addClass('currencies text-center');
    moreInfoContainer.attr('id', `currencies_${coin.id}`);
    cardBody.append(moreInfoContainer);

    cardsContainer.append(cardContainer);
    moreInfo2(coin.id);
  }
}

async function moreInfo2(coinId: string): Promise<void> {
  const toggleButtonInput = $(`#moreInfo_btn${coinId}`);
  const moreInfoContainer = $(`#currencies_${coinId}`);
  toggleButtonInput.on('click', async function () {
    toggleMoreInfo(moreInfoContainer, coinId);
  });
}

async function toggleMoreInfo(
  moreInfoContainer: JQuery<HTMLElement>,
  coinId: string
): Promise<void> {
  // add to local storage with a condition the coin info
  const coinInfoFromStorage = JSON.parse(localStorage['coinInfo'] || null);
  if (!coinInfoFromStorage) {
    const coinFetched: Coin = await fetchCoin(coinId);
    localStorage['coinInfo'] = JSON.stringify(coinFetched);
    const getMoreInfoContent: any = moreInfoContent(coinFetched);

    if (moreInfoContainer.is(':visible')) {
      moreInfoContainer.slideUp(300);
    } else {
      moreInfoContainer.html(getMoreInfoContent).hide().slideDown(300);
    }
  } else {
    // replace any...
    const getMoreInfoContent = moreInfoContent(coinInfoFromStorage);
    if (moreInfoContainer.is(':visible')) {
      moreInfoContainer.slideUp(300);
    } else {
      moreInfoContainer.html(getMoreInfoContent).hide().slideDown(300);
    }
  }
}

// Event listeners:
searchBtn.on('click', sortCoins);
