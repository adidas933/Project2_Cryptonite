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
  large: string;
  constructor(large: string) {
    this.large = large;
  }
}

// Variables:
let opacity: number;
const cardsContainer = $('.cardsContainer');
const moreInfoBtn = $('.moreInfoBtn');
const arrayOfCoins: Coin[] = [];

// Functions:
async function fetchCoins(): Promise<Coins[]> {
  const responseCoins = await fetch(
    'https://api.coingecko.com/api/v3/coins/list'
  );
  return await responseCoins.json();
}

// const arrayOfIds = [];
// for (let i = 0; i < 10; i++) {
// arrayOfIds.push(allCoins[i].id);
// fetch coin by id:
// const allCoins = coins;

async function moreInfo(coin: Coin, currenciesContainer: any) {
  currenciesContainer.html(`  <img src="${coin.image.large}" class="card-img-top">
  <p class="card-text">${coin.market_data.current_price.usd} $</p>
  <p class="card-text">${coin.market_data.current_price.eur} €</p>
  <p class="card-text">${coin.market_data.current_price.ils} ₪</p>`);
}

async function fetchCoin(coinId: string): Promise<Coin> {
  const responseCoin = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}`
  );
  const coinData = await responseCoin.json();
  const coin: Coin = new Coin(
    coinData.name,
    coinData.id,
    new CoinImage(coinData.image.large),
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
// arrayOfCoins.push(coin);
// localStorage['coins'] = JSON.stringify(arrayOfCoins);
// }
// return arrayOfCoins;

async function getCrypto(): Promise<void> {
  if (!localStorage['coins']) {
    const coins: Coins[] = await fetchCoins();
    for (let i = 0; i < 3; i++) {
      const coin: Coins = coins[i];
      createCard(coin);
    }
    localStorage['coins'] = JSON.stringify(coins);
  } else {
    const coinFromStorage: Coins[] =
      JSON.parse(localStorage['coins']) || undefined;
    for (let i = 0; i < 3; i++) {
      const coin: Coins = coinFromStorage[i];
      createCard(coin);
    }
  }
}
// I need the following:
// 1. split the card on createCard function to what is in the heading and what is in the more info part that is not visible.
// 2. when clicking the button on a specific coin - fetch the the image and currencies.
async function createCard(coin: Coins): Promise<void> {
  const card = $(`
  <div class="card" style="width: 18rem;">
  <div class="card-body">
  <div class="cardHeadingAndCheckBox">
  <h5 class="card-title">${coin.name}</h5>
  <div class="checkCrypto form-check form-switch">
  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked>
  <label class="form-check-label" for="flexSwitchCheckChecked">check</label>
  </div>
  </div>
  <a href="#" class="moreInfoBtn btn btn-primary" id="moreInfo_btn${coin.id}">More Info</a>
  <div class="currencies" id="currencies_${coin.id}"></div>
  </div>
  </div>
  `);
  cardsContainer.append(card);

  const moreInfoBtn = $(`#moreInfo_btn${coin.id}`);
  const currenciesContainer = $(`#currencies_${coin.id}`);
  const coinId = coin.id;

  moreInfoBtn.on('click', async function () {
    const coinFetched: Coin = await fetchCoin(coinId);
    moreInfo(coinFetched, currenciesContainer);

    opacity ? (opacity = 0) : (opacity = 1);
    currenciesContainer.css('opacity', opacity);
  });
}

// Event listeners:
document.addEventListener('DOMContentLoaded', getCrypto);
