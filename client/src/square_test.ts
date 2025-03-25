import * as assert from 'assert';
import { solid, split, toJson, fromJson, findSquare, replaceSquare } from './square';
import {cons, nil } from './list'


describe('square', function() {

  it('findSquare', function() {
    // TODO: write tests for findSquare() here
    assert.throws(() => findSquare(cons("NW", nil), solid("blue")));
    assert.deepEqual(findSquare(nil, solid("blue")), solid("blue"));
    assert.deepEqual(findSquare(
      cons("NW", nil), split(solid("blue"), solid("green"), solid("orange"), solid("pink"))),
      solid("blue"));
    assert.deepEqual(findSquare(
      cons("NE", nil), split(solid("blue"), solid("green"), solid("orange"), solid("pink"))),
      solid("green"));
    assert.deepEqual(findSquare(
      cons("SW", nil), split(solid("blue"), solid("green"), solid("orange"), solid("pink"))),
      solid("orange"));
    assert.deepEqual(findSquare(
      cons("SE", nil), split(solid("blue"), solid("green"), solid("orange"), solid("pink"))),
      solid("pink"));
    assert.deepEqual(findSquare(
      cons("SE", cons("NW",nil)), split(solid("blue"), solid("green"), solid("orange"), split(solid("yellow"), solid("green"), solid("orange"), solid("pink")))),
      solid("yellow"));
  });

  it('replaceSquare', function() {
    assert.throws(() => replaceSquare(cons("SE", nil), solid("orange"), solid("green")));
    assert.deepEqual(replaceSquare(
      nil,solid("yellow"),split(solid("blue"), solid("green"), solid("orange"), solid("pink"))),
      solid("yellow"));
    assert.deepEqual(replaceSquare(
      cons("NW",nil),solid("yellow"),split(solid("blue"), solid("green"), solid("orange"), solid("pink"))),
      split(solid("yellow"), solid("green"), solid("orange"), solid("pink")));
    assert.deepEqual(replaceSquare(
      cons("NE",nil),solid("yellow"),split(solid("blue"), solid("green"), solid("orange"), solid("pink"))),
      split(solid("blue"), solid("yellow"), solid("orange"), solid("pink")));
    assert.deepEqual(replaceSquare(
      cons("SW",nil),solid("yellow"),split(solid("blue"), solid("green"), solid("orange"), solid("pink"))),
      split(solid("blue"), solid("green"), solid("yellow"), solid("pink")));
    assert.deepEqual(replaceSquare(
      cons("SE",nil),solid("yellow"),split(solid("blue"), solid("green"), solid("orange"), solid("pink"))),
      split(solid("blue"), solid("green"), solid("orange"), solid("yellow")));
    assert.deepEqual(replaceSquare(
      cons("NW",cons("NW",nil)),solid("yellow"),split(split(solid("blue"), solid("green"), solid("orange"), solid("pink")), solid("green"), solid("orange"), solid("pink"))),
      split(split(solid("yellow"), solid("green"), solid("orange"), solid("pink")), solid("green"), solid("orange"), solid("pink")));
  });

  it('toJson', function() {
    assert.deepStrictEqual(toJson(solid("white")), "white");
    assert.deepStrictEqual(toJson(solid("green")), "green");

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepStrictEqual(toJson(s1),
      ["blue", "orange", "purple", "white"]);

    const s2 = split(s1, solid("green"), s1, solid("pink"));
    assert.deepStrictEqual(toJson(s2),
      [["blue", "orange", "purple", "white"], "green",
       ["blue", "orange", "purple", "white"], "pink"]);

    const s3 = split(solid("green"), s1, solid("yellow"), s1);
    assert.deepStrictEqual(toJson(s3),
      ["green", ["blue", "orange", "purple", "white"],
       "yellow", ["blue", "orange", "purple", "white"]]);
  });

  it('fromJson', function() {
    assert.deepStrictEqual(fromJson("white"), solid("white"));
    assert.deepStrictEqual(fromJson("green"), solid("green"));

    const s1 = split(solid("blue"), solid("orange"), solid("purple"), solid("white"));
    assert.deepStrictEqual(fromJson(["blue", "orange", "purple", "white"]), s1);

    assert.deepStrictEqual(
        fromJson([["blue", "orange", "purple", "white"], "green",
                 ["blue", "orange", "purple", "white"], "pink"]),
        split(s1, solid("green"), s1, solid("pink")));

    assert.deepStrictEqual(
        fromJson(["green", ["blue", "orange", "purple", "white"],
                  "yellow", ["blue", "orange", "purple", "white"]]),
        split(solid("green"), s1, solid("yellow"), s1));
  });

});
