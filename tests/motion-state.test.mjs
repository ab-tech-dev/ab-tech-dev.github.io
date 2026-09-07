import assert from 'node:assert/strict';
import test from 'node:test';
import { POSES, samplePose, resolveStops } from '../app/motion-state.ts';

test('every named chapter arrives at its exact designed pose', () => {
  POSES.forEach((pose, chapter) => assert.deepEqual(samplePose(chapter), pose));
});
test('the scene clamps safely before and after its story', () => {
  assert.deepEqual(samplePose(-4), POSES[0]);
  assert.deepEqual(samplePose(40), POSES.at(-1));
});
test('all chapter handoffs are continuous in both scroll directions', () => {
  for (let chapter = 1; chapter < POSES.length - 1; chapter++) {
    const before = samplePose(chapter - 0.0001);
    const after = samplePose(chapter + 0.0001);
    for (const key of Object.keys(before))
      assert.ok(Math.abs(before[key] - after[key]) < 0.00001);
  }
});
test('direct jumps and reverse scroll resolve identically without playback history', () => {
  const stops = [0, 350, 1200, 2100, 3600];
  assert.equal(resolveStops(1650, stops), 2.5);
  assert.equal(resolveStops(-50, stops), 0);
  assert.equal(resolveStops(8000, stops), 4);
  const scrolls = [0, 440, 2700, 1200, 50, 3600];
  const forward = scrolls.map((value) =>
    samplePose(resolveStops(value, stops)),
  );
  const backward = scrolls
    .toReversed()
    .map((value) => samplePose(resolveStops(value, stops)))
    .toReversed();
  assert.deepEqual(forward, backward);
});
test('changing content height remaps the current scroll without stale chapter state', () => {
  assert.equal(resolveStops(900, [0, 600, 1200]), 1.5);
  assert.equal(resolveStops(900, [0, 600, 1800]), 1.25);
  assert.ok(Number.isFinite(resolveStops(200, [0, 200, 200, 400])));
});
