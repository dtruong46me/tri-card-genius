
import React, { useState, useMemo, useEffect } from 'react';
import { Flashcard, CardSide } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import RefreshIcon from './icons/RefreshIcon';
import StarIcon from './icons/StarIcon';
import TrashIcon from './icons/TrashIcon';

interface FlashcardViewerProps {
  cards: Flashcard[];
  onToggleFavorite: (cardId: string) => void;
  onDeleteCard: (cardId: string) => void;
  deckName: string;
  onBack: () => void;
}

const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ cards, onToggleFavorite, onDeleteCard, deckName, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSide, setCurrentSide] = useState<CardSide>('A');
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    // Reset if cards array changes (e.g., switching decks)
    setCurrentIndex(0);
    setCurrentSide('A');
  }, [cards]);

  // Adjust index if it goes out of bounds after a deletion
  useEffect(() => {
    if (currentIndex >= cards.length && cards.length > 0) {
        setCurrentIndex(cards.length - 1);
    }
  }, [cards, currentIndex]);

  const currentCard = useMemo(() => cards[currentIndex], [cards, currentIndex]);

  const currentSideData = useMemo(() => {
    if (!currentCard) return { text: '', image: null };
    switch (currentSide) {
      case 'A': return { text: currentCard.sideA, image: currentCard.sideAImage };
      case 'B': return { text: currentCard.sideB, image: currentCard.sideBImage };
      case 'C': return { text: currentCard.sideC, image: currentCard.sideCImage };
      default: return { text: '', image: null };
    }
  }, [currentCard, currentSide]);

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSide((prevSide) => {
        if (prevSide === 'A') return 'B';
        if (prevSide === 'B') return 'C';
        return 'A';
      });
      setIsFlipping(false);
    }, 150);
  };
  
  const goToNextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    setCurrentSide('A');
  };

  const goToPrevCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
    setCurrentSide('A');
  };

  const handleDelete = () => {
      if (currentCard) {
          onDeleteCard(currentCard.id);
      }
  }

  if (cards.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
        <div className="flex justify-start w-full mb-4">
            <button onClick={onBack} className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300">
                <ChevronLeftIcon className="h-5 w-5" />
                Back
            </button>
        </div>
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">{deckName} is Empty!</h2>
        <p className="text-gray-400">Add some cards to this deck or select another one.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center">
       <div className="w-full flex justify-between items-center mb-4">
          <button onClick={onBack} className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300">
              <ChevronLeftIcon className="h-5 w-5" />
              Back
          </button>
          <h2 className="text-xl font-bold text-gray-300 text-right">Studying: <span className="text-cyan-400">{deckName}</span></h2>
       </div>
      <div 
        className="w-full min-h-[20rem] bg-gray-800 rounded-lg shadow-2xl flex items-center justify-center p-6 text-center cursor-pointer mb-4 relative perspective"
        onClick={handleFlip}
        aria-live="polite"
      >
        <div className={`transition-opacity duration-150 ${isFlipping ? 'opacity-0' : 'opacity-100'}`}>
           <div className="flex flex-col items-center justify-center gap-4 max-h-[calc(20rem-3rem)] overflow-y-auto p-2">
              {currentSideData.text && <p className="text-xl md:text-2xl text-white whitespace-pre-wrap">{currentSideData.text}</p>}
              {currentSideData.image && <img src={currentSideData.image} alt={`Content for Side ${currentSide}`} className="max-h-48 w-auto rounded-lg object-contain mt-2" />}
            </div>
        </div>
        <div className="absolute top-4 right-4 text-xs font-mono px-2 py-1 bg-cyan-500 text-gray-900 rounded">Side {currentSide}</div>
         <div className="absolute top-3 left-3 flex gap-2">
            <button
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(currentCard.id); }}
                className={`p-2 rounded-full transition-colors ${currentCard.isFavorite ? 'text-yellow-400 bg-yellow-400/20 hover:bg-yellow-400/30' : 'text-gray-400 bg-gray-700 hover:bg-gray-600'}`}
                aria-label={currentCard.isFavorite ? 'Unmark as favorite' : 'Mark as favorite'}
            >
                <StarIcon filled={!!currentCard.isFavorite} className="h-5 w-5" />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                className="p-2 rounded-full bg-gray-700 text-gray-400 hover:bg-red-600/80 hover:text-white transition-colors"
                aria-label="Delete card"
            >
                <TrashIcon className="h-5 w-5" />
            </button>
        </div>
      </div>

      <div className="flex items-center justify-center w-full space-x-4 mb-4">
        <button onClick={goToPrevCard} className="p-3 bg-gray-700 rounded-full hover:bg-cyan-600 transition-colors" aria-label="Previous card">
          <ChevronLeftIcon className="h-6 w-6 text-white" />
        </button>
        <button 
          onClick={handleFlip} 
          className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition-transform transform hover:scale-105"
        >
          <RefreshIcon />
          Flip
        </button>
        <button onClick={goToNextCard} className="p-3 bg-gray-700 rounded-full hover:bg-cyan-600 transition-colors" aria-label="Next card">
          <ChevronRightIcon className="h-6 w-6 text-white" />
        </button>
      </div>
      <p className="text-gray-400">Card {currentIndex + 1} of {cards.length}</p>
    </div>
  );
};

export default FlashcardViewer;
