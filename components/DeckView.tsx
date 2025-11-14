
import React from 'react';
import { Flashcard } from '../types';
import PlusIcon from './icons/PlusIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import TrashIcon from './icons/TrashIcon';
import StarIcon from './icons/StarIcon';
import PencilIcon from './icons/PencilIcon';

interface DeckViewProps {
  deckName: string;
  cards: Flashcard[];
  onLearnDeck: () => void;
  onCreateCard: () => void;
  onEditCard: (card: Flashcard) => void;
  onDeleteCard: (cardId: string) => void;
  onToggleFavorite: (cardId: string) => void;
  onBack: () => void;
}

const DeckView: React.FC<DeckViewProps> = ({
  deckName,
  cards,
  onLearnDeck,
  onCreateCard,
  onEditCard,
  onDeleteCard,
  onToggleFavorite,
  onBack,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 bg-gray-800 rounded-lg shadow-2xl">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 mr-4 rounded-full hover:bg-gray-700 transition-colors">
            <ChevronLeftIcon className="h-6 w-6 text-gray-300"/>
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 truncate">{deckName}</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={onLearnDeck}
          disabled={cards.length === 0}
          className="flex-1 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-md transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          <BookOpenIcon className="h-5 w-5" />
          Learn Deck
        </button>
        <button
          onClick={onCreateCard}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition-transform transform hover:scale-105"
        >
          <PlusIcon className="h-5 w-5" />
          Add New Card
        </button>
      </div>

      <div className="space-y-3">
        {cards.length > 0 ? (
          cards.map(card => (
            <div key={card.id} className="bg-gray-700 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate" title={card.sideA}>{card.sideA || '[Image]'}</p>
                <p className="text-gray-400 text-sm truncate" title={card.sideB}>{card.sideB || '[Image]'}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                <button
                    onClick={() => onToggleFavorite(card.id)}
                    className={`p-2 rounded-full transition-colors ${card.isFavorite ? 'text-yellow-400 hover:bg-yellow-400/20' : 'text-gray-400 hover:bg-gray-600'}`}
                    aria-label={card.isFavorite ? 'Unmark as favorite' : 'Mark as favorite'}
                >
                    <StarIcon filled={!!card.isFavorite} className="h-5 w-5" />
                </button>
                <button onClick={() => onEditCard(card)} className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-600 rounded-full transition-colors" aria-label="Edit card">
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button onClick={() => onDeleteCard(card.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded-full transition-colors" aria-label="Delete card">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-8">This deck is empty. Add your first card!</p>
        )}
      </div>
    </div>
  );
};

export default DeckView;
