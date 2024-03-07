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
let opacity: number;
const cardsContainer = $('.cardsContainer');
const moreInfoBtn = $('.moreInfoBtn');
const searchBtn = $('.searchBtn');
const searchInput: any = $('.searchInput');
const arrayOfCoins: Coin[] = [];

// Functions:

async function sortCoins() {
  // maybe i should get from storage... instead of fetching each time
  const coins = await fetchCoins();
  coins.forEach((coin) => {
    if (coin.symbol.toLowerCase() === searchInput.val().toLowerCase()) {
      cardsContainer.empty();
      createCard(coin);
    }
  });

  // get symbol of coins that is equal to search input.
}

async function fetchCoins(): Promise<Coins[]> {
  const responseCoins = await fetch(
    'https://api.coingecko.com/api/v3/coins/list'
  );
  return await responseCoins.json();
}

function moreInfoContent(coin: Coin) {
  const moreInfo = `<img src="${coin.image.thumb}">
  <p class="card-text">${coin.market_data.current_price.usd} $</p>
  <p class="card-text">${coin.market_data.current_price.eur} €</p>
  <p class="card-text">${coin.market_data.current_price.ils} ₪</p>`
  return moreInfo;
}

async function fetchCoin(coinId: string): Promise<Coin> {
  const responseCoin = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}`
  );
  const coinData = await responseCoin.json();

  // fix this to simple way without new...
  const coin: Coin = new Coin(
    coinData.name,
    coinData.id,
    new CoinImage(coinData.image.thumb),
    new MarketData(
      new CurrentPrice(
        coinData.market_data.current_price.usd,
        coinData.market_data.current_price.eur,
        coinData.market_data.current_price.ils
      )
    )
  );
  return coin;
}

async function getCrypto(): Promise<void> {
  if (!localStorage['coins']) {
    const coins: Coins[] = await fetchCoins();
    for (let i = 0; i < 100; i++) {
      const coin: Coins = coins[i];
      createCard(coin);
    }
    localStorage['coins'] = JSON.stringify(coins);
  } else {
    const coinFromStorage: Coins[] =
      JSON.parse(localStorage['coins']) || undefined;
    for (let i = 0; i < 100; i++) {
      const coin: Coins = coinFromStorage[i];
      createCard(coin);
    }
  }
}

function createCard(coin: Coins) {
  const cardContainer = $('<div>');
  cardContainer.addClass('card col-md-4 text-center');
  cardContainer.css('width', '18rem');

  const cardBody = $('<div>');
  cardBody.addClass('card-body');
  cardContainer.append(cardBody);

  const cardHeadingAndCheckBox = $('<div>');
  cardHeadingAndCheckBox.addClass('cardHeadingAndCheckBox d-flex p-2');
  cardBody.append(cardHeadingAndCheckBox);

  const cardTitle = $('<h5>');
  cardTitle.addClass('card-title col-6');
  cardTitle.html(coin.name);
  cardHeadingAndCheckBox.append(cardTitle);

  const toggleButtonContainer = $('<div>');
  toggleButtonContainer.addClass(
    'toggleButtonContainer form-check form-switch col-6 ms-5'
  );
  cardHeadingAndCheckBox.append(toggleButtonContainer);

  const toggleButtonInput = $('<input>');
  toggleButtonInput.addClass('form-check-input');
  toggleButtonInput.attr('id', 'flexSwitchCheckDefault');
  toggleButtonInput.attr('type', 'checkbox');
  toggleButtonInput.attr('role', 'switch');
  toggleButtonContainer.append(toggleButtonInput);

  const moreInfoBtn = $('<a>');
  moreInfoBtn.addClass('moreInfoBtn btn btn-primary');
  moreInfoBtn.attr('href', '#');
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
) {
  const coinFetched: Coin = await fetchCoin(coinId);
  const getMoreInfoContent: any = moreInfoContent(coinFetched);
  // opacity ? (opacity = 0) : (opacity = 1);
  // moreInfoContainer.css('opacity', opacity);
  if (moreInfoContainer.html()) {
    (moreInfoContainer as JQuery<HTMLElement>).html('');
  } else {
    (moreInfoContainer as JQuery<HTMLElement>).html(getMoreInfoContent);
  }
}

// Event listeners:
document.addEventListener('DOMContentLoaded', getCrypto);
searchBtn.on('click', sortCoins);
