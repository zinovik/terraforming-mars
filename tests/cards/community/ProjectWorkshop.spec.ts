import {expect} from 'chai';
import {ProjectWorkshop} from '../../../src/cards/community/ProjectWorkshop';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {CardType} from '../../../src/cards/CardType';
import {AdvancedAlloys} from '../../../src/cards/base/AdvancedAlloys';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Extremophiles} from '../../../src/cards/venusNext/Extremophiles';
import {SmallAnimals} from '../../../src/cards/base/SmallAnimals';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {ICard} from '../../../src/cards/ICard';
import {SelectOption} from '../../../src/inputs/SelectOption';

describe('ProjectWorkshop', function() {
  let card : ProjectWorkshop; let player : Player; let game : Game; let advancedAlloys : AdvancedAlloys;

  beforeEach(function() {
    card = new ProjectWorkshop();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
    advancedAlloys = new AdvancedAlloys();

    card.play(player);
    player.corporationCard = card;
  });

  it('Starts with correct resources', function() {
    expect(player.steel).to.eq(1);
    expect(player.titanium).to.eq(1);

    card.initialAction(player, game);
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0].cardType).to.eq(CardType.ACTIVE);
  });

  it('Can\'t act', function() {
    player.megaCredits = 2;
    expect(card.canAct(player)).is.not.true;
  });

  it('Can spend 3 MC to draw a blue card', function() {
    player.megaCredits = 3;

    expect(card.canAct(player)).is.true;
    card.action(player, game).cb();
    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.cardsInHand[0].cardType).to.eq(CardType.ACTIVE);
  });

  it('Can flip a played blue card and remove its ongoing effects', function() {
    player.playedCards.push(advancedAlloys);
    advancedAlloys.play(player);
    player.megaCredits = 0;

    expect(player.getSteelValue()).to.eq(3);
    expect(player.getTitaniumValue(game)).to.eq(4);

    card.action(player, game).cb();
    expect(player.playedCards).has.lengthOf(0);
    expect(game.dealer.discarded.includes(advancedAlloys)).is.true;
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.getSteelValue()).to.eq(2);
    expect(player.getTitaniumValue(game)).to.eq(3);
  });

  it('Converts VP to TR correctly', function() {
    const smallAnimals = new SmallAnimals();
    player.addResourceTo(smallAnimals, 5);

    const extremophiles = new Extremophiles();
    player.addResourceTo(extremophiles, 11);

    const originalTR = player.getTerraformRating();
    player.playedCards.push(smallAnimals, extremophiles);

    const selectOption = card.action(player, game);
    expect(selectOption instanceof SelectOption).is.true;

    const selectCard = selectOption.cb() as SelectCard<ICard>;

    selectCard.cb([smallAnimals]);
    expect(player.getTerraformRating()).to.eq(originalTR + 2);
    expect(player.cardsInHand).has.lengthOf(2);

    selectCard.cb([extremophiles]);
    expect(player.getTerraformRating()).to.eq(originalTR + 5);
    expect(player.cardsInHand).has.lengthOf(4);
  });

  it('Can select option if able to do both actions', function() {
    player.playedCards.push(advancedAlloys);
    player.megaCredits = 3;
    const result = card.action(player, game);
    expect(result instanceof OrOptions).is.true;
  });
});
