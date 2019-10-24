// pcm 20172018a Blackjack object

//constante com o número máximo de pontos para blackJack
const MAX_POINTS = 21;


// Classe BlackJack - construtor
class BlackJack {
    constructor() {
        // array com as cartas do dealer
        this.dealer_cards = [];
        // array com as cartas do player
        this.player_cards = [];
        // variável booleana que indica a vez do dealer jogar até ao fim
        this.dealerTurn = false;

        // objeto na forma literal com o estado do jogo
        this.state = {
            'gameEnded': false,
            'dealerWon': false,
            'playerBusted': false,
            'gameTie': false
        };

        //métodos utilizados no construtor (DEVEM SER IMPLEMENTADOS PELOS ALUNOS)
        this.new_deck = function () {
            let naipes = ["Ouros", "Paus", "Copas", "Espadas"]; // Ouros, Paus, Copas, Espadas
            let deck = [];
            let z = 0;
            for (var i = 0; i < naipes.length; i++) {
                for (var x = 0; x < 13; x++) {
                    deck[z] = [naipes[i], (x + 1)];
                    z++;
                }
            }
            return deck;

        };

        this.shuffle = function (deck) {
            let indices = [];
            let deckBaralhado = [];
            for (var i = 0; i < 52; i++) {
                indices[i] = (i + 1);

            }
            let size = indices.length;
            for (var i = 0; i < size; i++) {
                let num = Math.floor(Math.random() * indices.length);
                let ind = indices[num];
                deckBaralhado.push(deck[ind - 1]);
                indices.splice(num, 1);
            }
            return deckBaralhado;
        };

        // baralho de cartas baralhado
        this.deck = this.shuffle(this.new_deck());
    }

    // métodos
    // devolve as cartas do dealer num novo array (splice)
    get_dealer_cards() {
        return this.dealer_cards.slice();
    }

    // devolve as cartas do player num novo array (splice)
    get_player_cards() {
        return this.player_cards.slice();
    }

    // Ativa a variável booleana "dealerTurn"
    setDealerTurn(val) {
        this.dealerTurn = true;
    }

    //MÉTODOS QUE DEVEM SER IMPLEMENTADOS PELOS ALUNOS
    get_cards_value(cards) {
        let pontos = 0;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i][1] > 1 && cards[i][1] <= 9) {
                pontos += cards[i][1];
            } else if (cards[i][1] > 9 && cards[i][1] < 13) {
                pontos += 10;
            }else{
                if(pontos <= (MAX_POINTS-11)) {
                    pontos += 11;
                }else {
                    pontos += 1;
                }
            }
        }
        return pontos;
    }

    dealer_move() {
        this.dealer_cards.push(this.deck[0]);
        this.deck.splice(0, 1);
        return this.get_game_state();
    }

    player_move() {
        this.player_cards.push(this.deck[0]);
        this.deck.splice(0, 1);
        return this.get_game_state();
    }

    get_game_state() {
        let dealerP = this.get_cards_value(this.get_dealer_cards());
        let playerP = this.get_cards_value(this.get_player_cards());

        if (playerP === MAX_POINTS) { // Jogador t�m 21 Pontos - Jogador Ganha
            this.state.gameEnded = true;
        }else if(playerP > MAX_POINTS) { // Jogador t�m mais de 21 Pontos - Jogador Rebenta
            this.state.gameEnded = true;
            this.state.playerBusted = true;
            this.state.dealerWon = true;
        }else if(dealerP > MAX_POINTS) { //Dealer t�m mais de 21 e mais pontos que o PlayerP - Dealer Rebenta
            this.state.gameEnded = true;
        }else if(this.get_dealer_cards().length > 4 && this.get_player_cards().length > 4 && dealerP === playerP) {
            this.state.gameEnded = true;
            this.state.tie = true;
        }else if(this.dealerTurn && dealerP <= MAX_POINTS && dealerP > playerP || this.get_dealer_cards().length > 4) {
            this.state.gameEnded = true;
            this.state.dealerWon = true;
        }
        return this.state;
    }
}