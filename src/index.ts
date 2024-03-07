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

async function moreInfoContent(coin: Coin, currenciesContainer: any) {
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

function createCard(coin: Coins) {
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
  moreInfo2(coin.id);
}

async function moreInfo2(coinId: string): Promise<void> {
  const moreInfoBtn = $(`#moreInfo_btn${coinId}`);
  const currenciesContainer = $(`#currencies_${coinId}`);
  moreInfoBtn.on('click', async function () {
    toggleMoreInfo(currenciesContainer, coinId);
  });
}

async function toggleMoreInfo(
  currenciesContainer: JQuery<HTMLElement>,
  coinId: string
) {
  const coinFetched: Coin = await fetchCoin(coinId);
  await moreInfoContent(coinFetched, currenciesContainer);
  opacity ? (opacity = 0) : (opacity = 1);
  currenciesContainer.css('opacity', opacity);
}

// Event listeners:
document.addEventListener('DOMContentLoaded', getCrypto);
searchBtn.on('click', sortCoins);
