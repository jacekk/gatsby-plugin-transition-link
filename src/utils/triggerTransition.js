import { navigate } from "gatsby";
import random from "lodash/random";

const triggerTransition = ({
  to,
  event = null,
  exit = {},
  entry = {},
  inTransition,
  transitionIdHistory,
  updateContext
}) => {
  event.preventDefault();

  // console.log(entry);

  if (inTransition) return false;

  updateContext({
    inTransition: true,
    exitDelay: 0,
    exitLength: 0,
    exitState: {},
    exitTrigger: (exit, node) => exitTrigger(exit, node),
    entryTrigger: (entry, node) => entryTrigger(entry, node)
  });

  const {
    length: exitLength = 0,
    delay: exitDelay = 0,
    state: exitState = {},
    trigger: exitTrigger = false
  } = exit;
  const {
    length: entryLength = 0,
    delay: entryDelay = 0,
    state: entryState = {},
    trigger: entryTrigger = false
  } = entry;

  updateContext({
    entryLength: entryLength,
    entryDelay: entryDelay,
    exitLength: exitLength,
    exitDelay: exitDelay,
    entryProps: entry,
    exitProps: exit
  });

  // exitTrigger && exitTrigger(exit);

  setTimeout(() => {
    // after exitDelay
    const transitionId = random(10000, 99999, false);
    navigate(to, {
      state: { transitionId: transitionId }
    });
    updateContext({
      exitState: exitState,
      transitionIdHistory: [...transitionIdHistory, transitionId]
    });
  }, exitDelay);

  setTimeout(() => {
    // wait for entryDelay before we trigger our entry function and add entry state
    // entryTrigger && entryTrigger(entry);
    updateContext({
      entryState: entryState
    });
  }, exitDelay + entryDelay);

  // reset animation times so they dont apply when using browser back/forward.
  //  this will be replaced with a better solution in the future
  setTimeout(
    () =>
      updateContext({
        entryDelay: 0,
        entryLength: 0,
        exitDelay: 0,
        exitLength: 0,
        inTransition: false
      }),
    exitDelay + entryDelay + entryLength
  );
};

export { triggerTransition };
