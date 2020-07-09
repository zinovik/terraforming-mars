import { expect } from "chai";
import { Grass } from "../../src/cards/Grass";
import { Color } from "../../src/Color";
import { Player } from "../../src/Player";
import { Game } from "../../src/Game";
import { Resources } from '../../src/Resources';

describe("Grass", function () {
    let card : Grass, player : Player, game : Game;

    beforeEach(function() {
        card = new Grass();
        player = new Player("test", Color.BLUE, false);
        game = new Game("foobar", [player, player], player);
    });

    it("Can't play", function () {
        expect(card.canPlay(player, game)).to.eq(false);
    });

    it("Should play", function () {
        (game as any).temperature = -16;
        expect(card.canPlay(player, game)).to.eq(true);
        card.play(player);
        
        expect(player.getProduction(Resources.PLANTS)).to.eq(1);
        expect(player.plants).to.eq(3);
    });
});
