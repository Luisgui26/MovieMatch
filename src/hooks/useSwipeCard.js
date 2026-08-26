import { useCallback, useEffect, useRef } from 'react';

const maxSwipeThreshold = 118;
const minSwipeThreshold = 82;
const clickSuppressionThreshold = 22;
const dragIntentThreshold = 6;
const flickDistance = 34;
const flickVelocity = 0.5;
const gestureExitDuration = 180;
const buttonExitDuration = 550;

export function useSwipeCard({ onSwipe }) {
  const cardRef = useRef(null);
  const deckRef = useRef(null);
  const dragRef = useRef({ x: 0, y: 0 });
  const cardWidthRef = useRef(0);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragIntentRef = useRef('idle');
  const draggingRef = useRef(false);
  const exitTimerRef = useRef(0);
  const motionRef = useRef({ lastX: 0, lastTime: 0, velocityX: 0 });
  const suppressNextClickRef = useRef(false);
  const swipeHintRef = useRef('idle');

  const setCardPosition = useCallback((x, y, targetCard = cardRef.current) => {
    dragRef.current.x = x;
    dragRef.current.y = y;

    if (targetCard) {
      targetCard.style.setProperty('--drag-x', `${x}px`);
      targetCard.style.setProperty('--drag-y', `${y}px`);
      targetCard.style.setProperty('--drag-rotate', `${x / 18}deg`);
    }
  }, []);

  const updateSwipeHint = useCallback((nextHint) => {
    if (swipeHintRef.current === nextHint) {
      return;
    }

    swipeHintRef.current = nextHint;
    deckRef.current?.setAttribute('data-swipe-hint', nextHint);
  }, []);

  const setDraggingState = useCallback((isDragging) => {
    cardRef.current?.classList.toggle('is-dragging', isDragging);
  }, []);

  const resetCard = useCallback(() => {
    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = 0;
    }

    dragIntentRef.current = 'idle';
    draggingRef.current = false;
    setDraggingState(false);
    setCardPosition(0, 0);
    updateSwipeHint('idle');
  }, [setCardPosition, setDraggingState, updateSwipeHint]);

  function completeSwipe(direction, duration = gestureExitDuration) {
    if (exitTimerRef.current) {
      return;
    }

    const cardWidth = cardWidthRef.current || cardRef.current?.offsetWidth || 430;
    const exitDistance = window.innerWidth + cardWidth;
    const exitX = direction === 'save' ? exitDistance : -exitDistance;

    cardRef.current?.style.setProperty('--swipe-duration', `${duration}ms`);
    draggingRef.current = false;
    setDraggingState(false);
    updateSwipeHint(direction);
    setCardPosition(exitX, dragRef.current.y);

    exitTimerRef.current = window.setTimeout(() => {
      exitTimerRef.current = 0;
      onSwipe(direction);
      resetCard();
    }, duration);
  }

  function handlePointerDown(event) {
    if (exitTimerRef.current || (event.pointerType === 'mouse' && event.button !== 0)) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    cardWidthRef.current = event.currentTarget.offsetWidth;
    dragIntentRef.current = 'idle';
    draggingRef.current = true;
    suppressNextClickRef.current = false;
    dragStartRef.current = {
      x: event.clientX - dragRef.current.x,
      y: event.clientY - dragRef.current.y,
    };
    motionRef.current = {
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocityX: 0,
    };
    setDraggingState(true);
  }

  function handlePointerMove(event) {
    if (!draggingRef.current) {
      return;
    }

    const nextX = event.clientX - dragStartRef.current.x;
    const nextY = event.clientY - dragStartRef.current.y;
    const absoluteX = Math.abs(nextX);
    const absoluteY = Math.abs(nextY);

    if (dragIntentRef.current === 'idle' && absoluteX + absoluteY > dragIntentThreshold) {
      dragIntentRef.current = absoluteX >= absoluteY ? 'horizontal' : 'vertical';
    }

    if (dragIntentRef.current === 'vertical') {
      suppressNextClickRef.current = absoluteY > clickSuppressionThreshold;

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      resetCard();
      return;
    }

    if (dragIntentRef.current !== 'horizontal') {
      return;
    }

    event.preventDefault();

    const elapsed = Math.max(event.timeStamp - motionRef.current.lastTime, 1);
    const currentVelocity = (event.clientX - motionRef.current.lastX) / elapsed;
    motionRef.current = {
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocityX: (motionRef.current.velocityX * 0.35) + (currentVelocity * 0.65),
    };

    setCardPosition(nextX, nextY * 0.22, event.currentTarget);
    suppressNextClickRef.current = (
      absoluteX > clickSuppressionThreshold
      || absoluteY > clickSuppressionThreshold
    );

    if (nextX > 42) {
      updateSwipeHint('save');
    } else if (nextX < -42) {
      updateSwipeHint('reject');
    } else {
      updateSwipeHint('idle');
    }
  }

  function handlePointerUp(event) {
    if (!draggingRef.current) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const cardWidth = cardWidthRef.current || cardRef.current?.offsetWidth || 430;
    const swipeThreshold = Math.min(
      maxSwipeThreshold,
      Math.max(minSwipeThreshold, cardWidth * 0.27),
    );
    const isFastSwipe = (
      Math.abs(dragRef.current.x) >= flickDistance
      && Math.abs(motionRef.current.velocityX) >= flickVelocity
      && Math.sign(dragRef.current.x) === Math.sign(motionRef.current.velocityX)
    );

    if (dragRef.current.x >= swipeThreshold || (isFastSwipe && dragRef.current.x > 0)) {
      suppressNextClickRef.current = true;
      completeSwipe('save');
      return;
    }

    if (dragRef.current.x <= -swipeThreshold || (isFastSwipe && dragRef.current.x < 0)) {
      suppressNextClickRef.current = true;
      completeSwipe('reject');
      return;
    }

    resetCard();
  }

  function shouldIgnoreClick() {
    const shouldIgnore = suppressNextClickRef.current;
    suppressNextClickRef.current = false;
    return shouldIgnore;
  }

  useEffect(() => () => {
    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current);
    }
  }, []);

  return {
    cardRef,
    deckRef,
    cardStyle: {
      '--swipe-duration': `${gestureExitDuration}ms`,
    },
    handlePointerCancel: resetCard,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    resetCard,
    shouldIgnoreClick,
    triggerSwipe: (direction) => completeSwipe(direction, buttonExitDuration),
  };
}
