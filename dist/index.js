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
// TODO:
// 1. parallax scrolling
// 2. about page making
// 3. home page when clicking it show main page
// 4. live reports
// 5. after 5 favorite button clicked alert a massage module
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
const cardsDiv = $('.cardsDiv');
const moreInfoBtn = $('.moreInfoBtn');
const searchBtn = $('.searchBtn');
const searchInput = $('.searchInput');
const aboutBtn = $('.aboutBtn');
const liveReportsBtn = $('.liveReportsBtn');
const homeBtn = $('.homeBtn');
const arrayOfCoins = [];
const navbar = $('.navbar');
const spinner = $('.spinner');
let buttonClicked = false;
// Functions:
$(window).on('scroll', function () {
    if ($(this).scrollTop() > 0) {
        navbar.addClass('bg-dark bg-opacity-50');
    }
    else {
        navbar.removeClass('bg-dark bg-opacity-50');
    }
});
$(function getCrypto() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!localStorage['coins']) {
            spinner.removeClass('visually-hidden');
            const coins = yield fetchCoins();
            localStorage['coins'] = JSON.stringify(coins);
            createCard(coins);
            spinner.addClass('visually-hidden');
        }
        else {
            const coinFromStorage = JSON.parse(localStorage['coins']) || undefined;
            createCard(coinFromStorage);
        }
    });
});
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
function createCard(coins) {
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];
        const cardDiv = createCardDiv();
        const cardBody = createCardBody(cardDiv);
        const cardHeader = createCardHeader(cardBody);
        CreateFavoriteBtn(cardHeader);
        displayCoinSymbol(cardHeader, coin);
        displayCoinName(cardBody, coin);
        const moreInfoBtnId = createMoreInfoBtn(cardBody, coin);
        const moreInfoDiv = createMoreInfoDiv(cardBody, coin);
        createSpinnerInCard(moreInfoDiv);
        cardsDiv.append(cardDiv);
        moreInfoBtnId.on('click', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield showMoreInfo(moreInfoDiv, coin.id);
            });
        });
    }
}
// card content functions:
function createCardDiv() {
    const cardDiv = $('<div>');
    cardDiv.addClass('card col-md-4 text-center m-1 text-bg-secondary');
    cardDiv.css('width', '16rem');
    return cardDiv;
}
function createCardBody(cardDiv) {
    const cardBody = $('<div>');
    cardBody.addClass('card-body p-0');
    cardDiv.append(cardBody);
    return cardBody;
}
function createCardHeader(cardBody) {
    const cardHeader = $('<div>');
    cardHeader.addClass('cardHeadingAndCheckBox d-flex mb-3');
    cardBody.append(cardHeader);
    return cardHeader;
}
function CreateFavoriteBtn(cardHeader) {
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
function displayCoinSymbol(cardHeadingAndCheckBox, coin) {
    const coinSymbol = $('<h5>');
    coinSymbol.addClass('position-absolute');
    coinSymbol.html(coin.symbol.toUpperCase());
    cardHeadingAndCheckBox.append(coinSymbol);
    return coinSymbol;
}
function displayCoinName(cardBody, coin) {
    const coinNameDiv = $('<div>');
    coinNameDiv.addClass('mb-5 w-100');
    cardBody.append(coinNameDiv);
    const coinName = $('<h5>');
    coinName.addClass('card-Name col-6 w-100');
    coinName.html(coin.name);
    coinNameDiv.append(coinName);
    return coinName;
}
function createMoreInfoBtn(cardBody, coin) {
    const moreInfoBtn = $('<a>');
    moreInfoBtn.addClass('moreInfoBtn btn btn-outline-warning my-3 mx-auto d-flex align-items-center justify-content-center col-12 w-50');
    moreInfoBtn.attr('id', `moreInfoBtn${coin.id}`);
    moreInfoBtn.html('More Info');
    cardBody.append(moreInfoBtn);
    return moreInfoBtn;
}
function createMoreInfoDiv(cardBody, coin) {
    const moreInfoDiv = $('<div>');
    moreInfoDiv.addClass('currencies text-center');
    moreInfoDiv.attr('id', `moreInfoDiv${coin.id}`);
    cardBody.append(moreInfoDiv);
    return moreInfoDiv;
}
function createSpinnerInCard(moreInfoDiv) {
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
    const coins = JSON.parse(localStorage['coins'] || []);
    const searchInputValue = searchInput.val();
    const filteredCoins = coins.filter((coin) => coin.symbol.toLowerCase() === ((searchInputValue === null || searchInputValue === void 0 ? void 0 : searchInputValue.toLowerCase()) || ''));
    cardsDiv.empty();
    createCard(filteredCoins);
}
function getMoreInfoContent(coin) {
    const currencies = $('<div>');
    const dollar = $('<p>');
    dollar.addClass('card-text m-0');
    dollar.html(`${coin.market_data.current_price.usd} $`);
    const euro = $('<p>');
    euro.addClass('card-text m-0');
    euro.html(`${coin.market_data.current_price.eur} €`);
    const nis = $('<p>');
    nis.addClass('card-text mb-5');
    nis.html(`${coin.market_data.current_price.ils} ₪`);
    const coinLogo = $('<img>');
    coinLogo.attr('src', `${coin.image.thumb}`);
    currencies.append(coinLogo, dollar, euro, nis);
    return currencies;
}
function fetchCoin(coinId) {
    return __awaiter(this, void 0, void 0, function* () {
        const responseCoin = yield fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        return yield responseCoin.json();
    });
}
function showMoreInfo(moreInfoDiv, coinId) {
    return __awaiter(this, void 0, void 0, function* () {
        spinner.removeClass('visually-hidden').addClass('fixed-bottom');
        try {
            const coinInfoFromStorage = JSON.parse(localStorage['coinInfo'] || '{}');
            let coinFetched;
            if (!coinInfoFromStorage[coinId]) {
                coinFetched = yield fetchCoin(coinId);
                coinInfoFromStorage[coinId] = coinFetched;
                localStorage['coinInfo'] = JSON.stringify(coinInfoFromStorage);
            }
            else {
                coinFetched = coinInfoFromStorage[coinId];
            }
            const moreInfoContent = getMoreInfoContent(coinFetched);
            if (!buttonClicked) {
                moreInfoDiv.slideDown(300).html(moreInfoContent.html());
                buttonClicked = true;
            }
            else {
                moreInfoDiv.slideUp(300).html('');
                buttonClicked = false;
            }
        }
        catch (error) {
            console.error('Error fetching coin information:', error);
        }
        finally {
            spinner.addClass('visually-hidden');
        }
    });
}
function aboutPage() {
    cardsDiv.html('');
    cardsDiv.html(`About Page: Adi Vanunu Cryptonite image of me:... personal info:... project description: ...`);
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
