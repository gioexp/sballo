import { HEARTS_CARDS, DIAMONDS_CARDS, CLUBS_CARDS, SPADES_CARDS } from './constants';

export const getJollySeed = (card) => {
    if (HEARTS_CARDS.includes(card)) return "hearts";
    if (DIAMONDS_CARDS.includes(card)) return "diamonds";
    if (CLUBS_CARDS.includes(card)) return "clubs";
    if (SPADES_CARDS.includes(card)) return "spades";
}

export const getCardSeedArray = (card) => {
    if (HEARTS_CARDS.includes(card)) return HEARTS_CARDS;
    if (DIAMONDS_CARDS.includes(card)) return DIAMONDS_CARDS;
    if (CLUBS_CARDS.includes(card)) return CLUBS_CARDS;
    if (SPADES_CARDS.includes(card)) return SPADES_CARDS;
}

export const mayIPlayThisCard = (table, cardToPlay) => {
    if (table.playedCards[table.round][table.subRound].every(card => card === -1)) return true;
    let dominantSeedArray = getCardSeedArray(table.playedCards[table.round][table.subRound][0]);
    if (dominantSeedArray.includes(cardToPlay)) return true;
    else {
        // here card you are playing is not of the dominant seed. So, if you have another card with that seed, 
        // you cannot play this card, otherwise yes (you don't have a card with dominant seed)
        let myAvailableCardsToPlay = table.shifts[table.round][table.turnIndex].filter(card => !table.playedCards[table.round].flat().includes(card));
        let myCardsOfDominantSeed = myAvailableCardsToPlay.filter(card => dominantSeedArray.includes(card));
        if (myCardsOfDominantSeed.length > 0) return false;
        else return true;
    }
}

export const selectOneCardToPlay = (table) => {
    let availableCards = table.shifts[table.round][table.turnIndex].filter(card => !table.playedCards[table.round].flat().includes(card));
    let cardToPlay = -1;
    for (let i = 0; i < availableCards.length; i++) {
        if (mayIPlayThisCard(table, availableCards[i])) {
            cardToPlay = availableCards[i];
            break;
        }
    }
    return cardToPlay;
}

export const determinateSubTurnWinnerIndex = (table) => {
    let cardsPlayed = table.playedCards[table.round][table.subRound];
    let jollySeedArray = getCardSeedArray(table.jolly[table.round]);
    let jollyCards = cardsPlayed.filter(card => jollySeedArray.includes(card));
    let winnerCard = -1;
    let winnerIndex = -1;
    if (jollyCards.length > 0) winnerCard = Math.max(...jollyCards);
    else {
        let firstCardSeedArray = getCardSeedArray(table.playedCards[table.round][table.subRound][0]);
        let winnerCards = cardsPlayed.filter(card => firstCardSeedArray.includes(card));
        winnerCard = Math.max(...winnerCards);
    }

    for (let i = 0; i < table.shifts[table.round].length; i++) {
        for (let j = 0; j < table.shifts[table.round][i].length; j++) {
            if (table.shifts[table.round][i][j] === winnerCard) {
                winnerIndex = i;
                break;
            }
        }
        if (winnerIndex !== -1) break;
    }
    return winnerIndex;
}