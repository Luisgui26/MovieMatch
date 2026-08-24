import { useCallback, useEffect, useRef, useState } from 'react';

const swipeThreshold = 140;
const clickSuppressionThreshold = 22;
const dragIntentThreshold = 10;

export function useSwipeCard({ onSwipe }) {
  const [isDragging, setIsDragging] = useState(false);
  const [swipeHint, setSwipeHint] = useState('idle');
  const cardRef = useRef(null);
  const dragRef = useRef({ x: 0, y: 0 });
  const dragStartRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);
  const dragIntentRef = useRef('idle');
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
    dragIntentRef.current = 'idle';
    setIsDragging(false);
    setCardPosition(0, 0);
    updateSwipeHint('idle');
  }, [setCardPosition, updateSwipeHint]);

  function completeSwipe(direction) {
    const exitX = direction === 'save' ? 620 : -620;
    setIsDragging(false);
    updateSwipeHint(direction);
    setCardPosition(exitX, dragRef.current.y);

    window.setTimeout(() => {
      onSwipe(direction);
      resetCard();
    }, 260);
  }

  function handlePointerDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragIntentRef.current = 'idle';
    suppressNextClickRef.current = false;
    dragStartRef.current = {
      x: event.clientX - dragRef.current.x,
      y: event.clientY - dragRef.current.y,
    };
    setIsDragging(true);
  }

  function handlePointerMove(event) {
    if (!isDragging) {
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
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      resetCard();
      return;
    }

    setCardPosition(nextX, nextY * 0.35);
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
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (dragRef.current.x > swipeThreshold) {
      suppressNextClickRef.current = true;
      completeSwipe('save');
      return;
    }

    if (dragRef.current.x < -swipeThreshold) {
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
