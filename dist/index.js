"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Classes:
class Coins {
    constructor(id, symbol, name) {
        this.id = id;
        this.symbol = symbol;
        this.name = name;
    }
}
class Coin {
    constructor(name, id, image, market_data) {
        this.name = name;
        this.id = id;
        this.image = image;
        this.market_data = market_data;
    }
}
class MarketData {
    constructor(current_price) {
        this.current_price = current_price;
    }
}
class CurrentPrice {
    constructor(usd, eur, ils) {
        this.usd = usd;
        this.eur = eur;
        this.ils = ils;
    }
}
class CoinImage {
    constructor(large) {
        this.large = large;
    }
}
// Variables:
let opacity;
const cardsContainer = $('.cardsContainer');
const moreInfoBtn = $('.moreInfoBtn');
const searchBtn = $('.searchBtn');
const searchInput = $('.searchInput');
const arrayOfCoins = [];
// Functions:
function sortCoins() {
    return __awaiter(this, void 0, void 0, function* () {
        // maybe i should get from storage... instead of fetching each time
        const coins = yield fetchCoins();
        coins.forEach((coin) => {
            if (coin.symbol.toLowerCase() === searchInput.val().toLowerCase()) {
                cardsContainer.empty();
                createCard(coin);
            }
        });
        // get symbol of coins that is equal to search input.
    });
}
function fetchCoins() {
    return __awaiter(this, void 0, void 0, function* () {
        const responseCoins = yield fetch('https://api.coingecko.com/api/v3/coins/list');
        return yield responseCoins.json();
    });
}
function moreInfoContent(coin, currenciesContainer) {
    return __awaiter(this, void 0, void 0, function* () {
        currenciesContainer.html(`  <img src="${coin.image.large}" class="card-img-top">
    <p class="card-text">${coin.market_data.current_price.usd} $</p>
    <p class="card-text">${coin.market_data.current_price.eur} €</p>
    <p class="card-text">${coin.market_data.current_price.ils} ₪</p>`);
    });
}
function fetchCoin(coinId) {
    return __awaiter(this, void 0, void 0, function* () {
        const responseCoin = yield fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        const coinData = yield responseCoin.json();
        const coin = new Coin(coinData.name, coinData.id, new CoinImage(coinData.image.large), new MarketData(new CurrentPrice(coinData.market_data.current_price.usd, coinData.market_data.current_price.eur, coinData.market_data.current_price.ils)));
        return coin;
    });
}
function getCrypto() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!localStorage['coins']) {
            const coins = yield fetchCoins();
            for (let i = 0; i < 3; i++) {
                const coin = coins[i];
                createCard(coin);
            }
            localStorage['coins'] = JSON.stringify(coins);
        }
        else {
            const coinFromStorage = JSON.parse(localStorage['coins']) || undefined;
            for (let i = 0; i < 3; i++) {
                const coin = coinFromStorage[i];
                createCard(coin);
            }
        }
    });
}
function createCard(coin) {
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
function moreInfo2(coinId) {
    return __awaiter(this, void 0, void 0, function* () {
        const moreInfoBtn = $(`#moreInfo_btn${coinId}`);
        const currenciesContainer = $(`#currencies_${coinId}`);
        moreInfoBtn.on('click', function () {
            return __awaiter(this, void 0, void 0, function* () {
                toggleMoreInfo(currenciesContainer, coinId);
            });
        });
    });
}
function toggleMoreInfo(currenciesContainer, coinId) {
    return __awaiter(this, void 0, void 0, function* () {
        const coinFetched = yield fetchCoin(coinId);
        yield moreInfoContent(coinFetched, currenciesContainer);
        opacity ? (opacity = 0) : (opacity = 1);
        currenciesContainer.css('opacity', opacity);
    });
}
// Event listeners:
document.addEventListener('DOMContentLoaded', getCrypto);
searchBtn.on('click', sortCoins);
