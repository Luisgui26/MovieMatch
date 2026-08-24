import { useCallback, useEffect, useRef, useState } from 'react';

const maxSwipeThreshold = 118;
const minSwipeThreshold = 82;
const clickSuppressionThreshold = 22;
const dragIntentThreshold = 6;
const flickDistance = 34;
const flickVelocity = 0.5;
const exitDuration = 180;

export function useSwipeCard({ onSwipe }) {
  const [isDragging, setIsDragging] = useState(false);
  const [swipeHint, setSwipeHint] = useState('idle');
  const cardRef = useRef(null);
  const dragRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);
  const dragIntentRef = useRef('idle');
  const draggingRef = useRef(false);
  const exitTimerRef = useRef(0);
  const motionRef = useRef({ lastX: 0, lastTime: 0, velocityX: 0 });
  const suppressNextClickRef = useRef(false);
  const swipeHintRef = useRef('idle');

  const setCardPosition = useCallback((x, y) => {
    dragRef.current = { x, y };

    if (frameRef.current) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      const card = cardRef.current;

      if (card) {
        card.style.setProperty('--drag-x', `${dragRef.current.x}px`);
        card.style.setProperty('--drag-y', `${dragRef.current.y}px`);
        card.style.setProperty('--drag-rotate', `${dragRef.current.x / 18}deg`);
      }

      frameRef.current = 0;
    });
  }, []);

  const updateSwipeHint = useCallback((nextHint) => {
    if (swipeHintRef.current === nextHint) {
      return;
    }

    swipeHintRef.current = nextHint;
    setSwipeHint(nextHint);
  }, []);

  const resetCard = useCallback(() => {
    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = 0;
    }

    dragIntentRef.current = 'idle';
    draggingRef.current = false;
    setIsDragging(false);
    setCardPosition(0, 0);
    updateSwipeHint('idle');
  }, [setCardPosition, updateSwipeHint]);

  function completeSwipe(direction) {
    if (exitTimerRef.current) {
      return;
    }

    const cardWidth = cardRef.current?.offsetWidth || 430;
    const exitDistance = window.innerWidth + cardWidth;
    const exitX = direction === 'save' ? exitDistance : -exitDistance;

    draggingRef.current = false;
    setIsDragging(false);
    updateSwipeHint(direction);
    setCardPosition(exitX, dragRef.current.y);

    exitTimerRef.current = window.setTimeout(() => {
      exitTimerRef.current = 0;
      onSwipe(direction);
      resetCard();
    }, exitDuration);
  }

  function handlePointerDown(event) {
    if (exitTimerRef.current || (event.pointerType === 'mouse' && event.button !== 0)) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
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
    setIsDragging(true);
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

    setCardPosition(nextX, nextY * 0.22);
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

    const cardWidth = cardRef.current?.offsetWidth || 430;
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
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
    }

    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current);
    }
  }, []);

  return {
    cardRef,
    cardStyle: {
      '--drag-x': '0px',
      '--drag-y': '0px',
      '--drag-rotate': '0deg',
    },
    drag: { isDragging },
    handlePointerCancel: resetCard,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    resetCard,
    shouldIgnoreClick,
    swipeHint,
    triggerSwipe: completeSwipe,
  };
}
