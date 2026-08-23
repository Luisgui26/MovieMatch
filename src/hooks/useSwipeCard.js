import { useRef, useState } from 'react';

const swipeThreshold = 140;

export function useSwipeCard({ onSwipe }) {
  const [drag, setDrag] = useState({ x: 0, y: 0, isDragging: false });
  const [swipeHint, setSwipeHint] = useState('idle');
  const dragStartRef = useRef({ x: 0, y: 0 });

  function resetCard() {
    setDrag({ x: 0, y: 0, isDragging: false });
    setSwipeHint('idle');
  }

  function completeSwipe(direction) {
    const exitX = direction === 'save' ? 620 : -620;
    setSwipeHint(direction);
    setDrag((currentDrag) => ({ x: exitX, y: currentDrag.y, isDragging: false }));

    window.setTimeout(() => {
      onSwipe(direction);
      resetCard();
    }, 260);
  }

  function handlePointerDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      x: event.clientX - drag.x,
      y: event.clientY - drag.y,
    };
    setDrag((currentDrag) => ({ ...currentDrag, isDragging: true }));
  }

  function handlePointerMove(event) {
    if (!drag.isDragging) {
      return;
    }

    const nextX = event.clientX - dragStartRef.current.x;
    const nextY = event.clientY - dragStartRef.current.y;

    setDrag({ x: nextX, y: nextY, isDragging: true });

    if (nextX > 42) {
      setSwipeHint('save');
    } else if (nextX < -42) {
      setSwipeHint('reject');
    } else {
      setSwipeHint('idle');
    }
  }

  function handlePointerUp(event) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (drag.x > swipeThreshold) {
      completeSwipe('save');
      return;
    }

    if (drag.x < -swipeThreshold) {
      completeSwipe('reject');
      return;
    }

    resetCard();
  }

  return {
    cardStyle: {
      '--drag-x': `${drag.x}px`,
      '--drag-y': `${drag.y}px`,
      '--drag-rotate': `${drag.x / 18}deg`,
    },
    drag,
    handlePointerCancel: resetCard,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    resetCard,
    swipeHint,
    triggerSwipe: completeSwipe,
  };
}
