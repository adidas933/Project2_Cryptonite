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
    constructor(thumb) {
        this.thumb = thumb;
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
function moreInfoContent(coin) {
    const moreInfo = `<img src="${coin.image.thumb}">
  <p class="card-text">${coin.market_data.current_price.usd} $</p>
  <p class="card-text">${coin.market_data.current_price.eur} €</p>
  <p class="card-text">${coin.market_data.current_price.ils} ₪</p>`;
    return moreInfo;
}
function fetchCoin(coinId) {
    return __awaiter(this, void 0, void 0, function* () {
        const responseCoin = yield fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        const coinData = yield responseCoin.json();
        // fix this to simple way without new...
        const coin = new Coin(coinData.name, coinData.id, new CoinImage(coinData.image.thumb), new MarketData(new CurrentPrice(coinData.market_data.current_price.usd, coinData.market_data.current_price.eur, coinData.market_data.current_price.ils)));
        return coin;
    });
}
function getCrypto() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!localStorage['coins']) {
            const coins = yield fetchCoins();
            for (let i = 0; i < 100; i++) {
                const coin = coins[i];
                createCard(coin);
            }
            localStorage['coins'] = JSON.stringify(coins);
        }
        else {
            const coinFromStorage = JSON.parse(localStorage['coins']) || undefined;
            for (let i = 0; i < 100; i++) {
                const coin = coinFromStorage[i];
                createCard(coin);
            }
        }
    });
}
function createCard(coin) {
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
    toggleButtonContainer.addClass('toggleButtonContainer form-check form-switch col-6 ms-5');
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
function moreInfo2(coinId) {
    return __awaiter(this, void 0, void 0, function* () {
        const toggleButtonInput = $(`#moreInfo_btn${coinId}`);
        const moreInfoContainer = $(`#currencies_${coinId}`);
        toggleButtonInput.on('click', function () {
            return __awaiter(this, void 0, void 0, function* () {
                toggleMoreInfo(moreInfoContainer, coinId);
            });
        });
    });
}
function toggleMoreInfo(moreInfoContainer, coinId) {
    return __awaiter(this, void 0, void 0, function* () {
        const coinFetched = yield fetchCoin(coinId);
        const getMoreInfoContent = moreInfoContent(coinFetched);
        // opacity ? (opacity = 0) : (opacity = 1);
        // moreInfoContainer.css('opacity', opacity);
        if (moreInfoContainer.html()) {
            moreInfoContainer.html('');
        }
        else {
            moreInfoContainer.html(getMoreInfoContent);
        }
    });
}
// Event listeners:
document.addEventListener('DOMContentLoaded', getCrypto);
searchBtn.on('click', sortCoins);
