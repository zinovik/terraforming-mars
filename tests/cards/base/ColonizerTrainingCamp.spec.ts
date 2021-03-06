import {expect} from 'chai';
import {ColonizerTrainingCamp} from '../../../src/cards/base/ColonizerTrainingCamp';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';

describe('ColonizerTrainingCamp', function() {
  let card : ColonizerTrainingCamp; let player : Player; let game : Game;

  beforeEach(function() {
    card = new ColonizerTrainingCamp();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Can\'t play', function() {
    (game as any).oxygenLevel = 6;
    expect(card.canPlay(player, game)).is.not.true;
  });
  it('Should play', function() {
    (game as any).oxygenLevel = 5;
    expect(card.canPlay(player, game)).is.true;

    card.play();
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
  });
});
