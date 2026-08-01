/**
 * A bag that hands out one item at a time and covers everything before it
 * repeats.
 *
 * Picking at random on every draw looks fair and is not: nothing stops an item
 * being chosen again immediately, so the draws pile up on a subset while other
 * items go unseen. Dealing off a shuffled bag instead means everything is seen
 * once before anything is seen twice, and the bag only reshuffles once it has
 * run out.
 */
export const makeBag = <T>(items: readonly T[]): (() => T) => {
  let rest: T[] = []
  let last: T | undefined

  const refill = (): void => {
    // Fisher-Yates, so every ordering is equally likely.
    rest = [...items]
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[rest[i], rest[j]] = [rest[j], rest[i]]
    }
    /*
     * The one seam a shuffled bag still has. Draws come off the end, so if the
     * new bag happens to end with the item the old one finished on, that item
     * shows twice in a row across the join — which is the exact thing dealing
     * from a bag is meant to prevent, and the only place a reader would ever
     * notice it. Swap it with any other position rather than reshuffling, which
     * could land on the same arrangement again. Two items or fewer and there is
     * no arrangement that avoids it, so leave it alone rather than spin.
     */
    if (rest.length > 2 && rest[rest.length - 1] === last) {
      const j = Math.floor(Math.random() * (rest.length - 1))
      ;[rest[rest.length - 1], rest[j]] = [rest[j], rest[rest.length - 1]]
    }
  }

  return () => {
    if (!rest.length) refill()
    last = rest.pop()!
    return last
  }
}
