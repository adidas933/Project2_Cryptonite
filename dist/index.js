"use strict";
// PROBLEMS:
// when i click the more info button it wont work the first time
// when I click the more info button the first time - I get the right info on the coin card button I clicked. after that when I click another coind more info button I get the first coin info. maybe something with the local storage that needs an if statement...
// when page is loaded it brings me to the top of page.
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
const cardsContainer = $('.cardsContainer');
const moreInfoBtn = $('.moreInfoBtn');
const searchBtn = $('.searchBtn');
const searchInput = $('.searchInput');
const arrayOfCoins = [];
// Functions:
$(window).on('unload', function () {
    $(window).scrollTop(0);
});
function sortCoins() {
    const coins = JSON.parse(localStorage['coins'] || []);
    const searchInputValue = searchInput.val();
    const filteredCoins = coins.filter((coin) => coin.symbol.toLowerCase() === ((searchInputValue === null || searchInputValue === void 0 ? void 0 : searchInputValue.toLowerCase()) || ''));
    cardsContainer.empty();
    createCard(filteredCoins);
}
function fetchCoins() {
    return __awaiter(this, void 0, void 0, function* () {
        const responseCoins = yield fetch('https://api.coingecko.com/api/v3/coins/list');
        const oneHundredCoins = [];
        const coins = yield responseCoins.json();
        for (let i = 0; i < 100; i++) {
            oneHundredCoins.push(coins[i]);
        }
        return oneHundredCoins;
    });
}
function moreInfoContent(coin) {
    const moreInfo = `<img src="${coin.image.thumb}">
  <p class="card-text m-0">${coin.id} = ${coin.market_data.current_price.usd} $</p>
  <p class="card-text m-0">${coin.id} = ${coin.market_data.current_price.eur} €</p>
  <p class="card-text mb-5">${coin.id} = ${coin.market_data.current_price.ils} ₪</p>`;
    return moreInfo;
}
function fetchCoin(coinId) {
    return __awaiter(this, void 0, void 0, function* () {
        const responseCoin = yield fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        // returns coin info
        return yield responseCoin.json();
    });
}
$(function getCrypto() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!localStorage['coins']) {
            // 100 coins:
            const coins = yield fetchCoins();
            localStorage['coins'] = JSON.stringify(coins);
            createCard(coins);
        }
        else {
            const coinFromStorage = JSON.parse(localStorage['coins']) || undefined;
            createCard(coinFromStorage);
        }
    });
});
// make small functions:
function createCard(coins) {
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
        toggleButtonContainer.addClass('toggleButtonContainer form-check form-switch col-6');
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
        moreInfoBtn.addClass('moreInfoBtn btn btn-primary position-absolute bottom-0 translate-middle-x mt-3');
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
        // add to local storage with a condition the coin info
        const coinInfoFromStorage = JSON.parse(localStorage['coinInfo'] || null);
        if (!coinInfoFromStorage) {
            const coinFetched = yield fetchCoin(coinId);
            localStorage['coinInfo'] = JSON.stringify(coinFetched);
            const getMoreInfoContent = moreInfoContent(coinFetched);
            if (moreInfoContainer.is(':visible')) {
                moreInfoContainer.slideUp(300);
            }
            else {
                moreInfoContainer.html(getMoreInfoContent).hide().slideDown(300);
            }
        }
        else {
            // replace any...
            const getMoreInfoContent = moreInfoContent(coinInfoFromStorage);
            if (moreInfoContainer.is(':visible')) {
                moreInfoContainer.slideUp(300);
            }
            else {
                moreInfoContainer.html(getMoreInfoContent).hide().slideDown(300);
            }
        }
    });
}
// Event listeners:
searchBtn.on('click', sortCoins);
