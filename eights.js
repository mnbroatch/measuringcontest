import { INVALID_MOVE } from 'boardgame.io/core';

const CrazyEights = {
  name: 'crazy-eights',

  setup: () => ({
    deck: createDeck(),
    discard: [],
    players: {},
    currentSuit: null,
  }),

  moves: {
    playCard: ({ G, playerID, events }, cardIndex) => {
      const hand = G.players[playerID].hand;
      if (!hand[cardIndex]) return INVALID_MOVE;

      const card = hand[cardIndex];
      const lastCard = G.discard[G.discard.length - 1];

      // Check if move is valid
      if (!isValidPlay(card, lastCard, G.currentSuit)) {
        return INVALID_MOVE;
      }

      // Play the card
      hand.splice(cardIndex, 1);
      G.discard.push(card);

      // If it's an eight, move to suit selection stage
      if (card.rank === '8') {
        events.setStage('selectSuit');
        return;
      }

      // Normal play - update suit and end turn
      G.currentSuit = card.suit;
      events.endTurn();
    },

    nameSuit: ({ G, playerID, events }, suit) => {
      if (!['', '', '', ''].includes(suit)) return INVALID_MOVE;

      G.currentSuit = suit;
      events.endTurn();
    },

    drawCard: ({ G, playerID, events }) => {
      const player = G.players[playerID];
      
      if (G.deck.length === 0) {
        // Reshuffle discard
        const lastCard = G.discard.pop();
        G.deck = G.discard;
        G.discard = [lastCard];
      }

      const card = G.deck.pop();
      player.hand.push(card);
      events.endTurn();
    },
  },

  turn: {
    stages: {
      play: {
        moves: ['playCard', 'drawCard'],
      },
      selectSuit: {
        moves: ['nameSuit'],
      },
    },
    activateOnSetup: true,
  },

  endIf: ({ G }) => {
    for (const [id, player] of Object.entries(G.players)) {
      if (player.hand.length === 0) {
        return { winner: id };
      }
    }
  },

  playerView: ({ G, playerID }) => ({
    ...G,
    players: {
      ...Object.keys(G.players).reduce((acc, id) => {
        acc[id] = {
          hand: id === playerID ? G.players[id].hand : { length: G.players[id].hand.length },
        };
        return acc;
      }, {}),
    },
  }),
};

function createDeck() {
  const suits = ['', '', '', ''];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const deck = [];

  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit, rank });
    }
  }

  return deck.sort(() => Math.random() - 0.5);
}

function isValidPlay(card, lastCard, currentSuit) {
  // Eights are always playable
  if (card.rank === '8') return true;

  // If an eight was played, check against the named suit
  if (currentSuit && currentSuit !== card.suit && currentSuit !== card.rank) {
    return false;
  }

  // Normal rules: same suit or same rank
  return card.suit === lastCard.suit || card.rank === lastCard.rank;
}

export default CrazyEights;
