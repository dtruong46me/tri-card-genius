
import React, { useState } from 'react';
import FolderIcon from './icons/FolderIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import TrashIcon from './icons/TrashIcon';
import PlusIcon from './icons/PlusIcon';
import StarIcon from './icons/StarIcon';

interface DeckListProps {
  decks: { name: string; cardCount: number }[];
  favoriteCount: number;
  totalCardCount: number;
  onSelectDeck: (deckName: string) => void;
  onDeleteDeck: (deckName: string) => void;
  onCreateDeck: (deckName: string) => void;
}

const DeckList: React.FC<DeckListProps> = ({
  decks,
  favoriteCount,
  totalCardCount,
  onSelectDeck,
  onDeleteDeck,
  onCreateDeck,
}) => {
  const [newDeckName, setNewDeckName] = useState('');
  const [error, setError] = useState('');
  
  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckName.trim()) {
      setError('Deck name cannot be empty.');
      return;
    }
    if (decks.some(d => d.name.toLowerCase() === newDeckName.trim().toLowerCase()) || newDeckName.trim().toLowerCase() === 'favorites') {
      setError('A deck with this name already exists.');
      return;
    }
    onCreateDeck(newDeckName.trim());
    setNewDeckName('');
    setError('');
  };

  const userDecks = decks.filter(d => d.name !== 'Default');
  const defaultDeck = decks.find(d => d.name === 'Default');

  const specialDecks = [
    { name: 'Favorites', count: favoriteCount, color: 'text-yellow-400' },
    { name: 'All Cards', count: totalCardCount, color: 'text-indigo-400' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 bg-gray-800 rounded-lg shadow-2xl">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-cyan-400 mb-6">Your Decks</h2>
      <div className="space-y-3">
        {specialDecks.map(deck => (
          <div key={deck.name} onClick={() => onSelectDeck(deck.name)} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center transition-all hover:shadow-lg hover:bg-gray-600 cursor-pointer">
              <div className="flex items-center gap-3">
                {deck.name === 'Favorites' ? <StarIcon filled className={`h-6 w-6 ${deck.color}`} /> : <FolderIcon className={`h-6 w-6 ${deck.color}`} />}
                <div>
                  <span className="font-semibold text-white">{deck.name}</span>
                  <p className="text-xs text-gray-400">{deck.count} {deck.count === 1 ? 'card' : 'cards'}</p>
                </div>
              </div>
              <button
                aria-label={`Learn ${deck.name}`}
                className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md bg-cyan-600/80 text-white"
              >
                <BookOpenIcon className="h-4 w-4" />
                Learn
              </button>
          </div>
        ))}
        
        <hr className="border-gray-600 !my-6" />

        {defaultDeck && (
            <div key={defaultDeck.name} onClick={() => onSelectDeck(defaultDeck.name)} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center transition-all hover:shadow-lg hover:bg-gray-600 cursor-pointer">
              <div className="flex items-center gap-3">
                <FolderIcon className="h-6 w-6 text-cyan-400" />
                <div>
                  <span className="font-semibold text-white">{defaultDeck.name}</span>
                  <p className="text-xs text-gray-400">{defaultDeck.cardCount} {defaultDeck.cardCount === 1 ? 'card' : 'cards'}</p>
                </div>
              </div>
            </div>
        )}

        {userDecks.map(({ name, cardCount }) => (
          <div key={name} onClick={() => onSelectDeck(name)} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center transition-all hover:shadow-lg hover:bg-gray-600 cursor-pointer">
            <div className="flex items-center gap-3">
              <FolderIcon className="h-6 w-6 text-cyan-400" />
              <div>
                <span className="font-semibold text-white">{name}</span>
                <p className="text-xs text-gray-400">{cardCount} {cardCount === 1 ? 'card' : 'cards'}</p>
              </div>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if(window.confirm(`Are you sure you want to delete the deck "${name}" and all its cards?`)) {
                        onDeleteDeck(name);
                    }
                }}
                className="p-2 rounded-md bg-gray-600 hover:bg-red-600/80 text-gray-300 hover:text-white transition-colors"
                aria-label={`Delete deck ${name}`}
              >
                <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleCreateDeck} className="mt-8 pt-6 border-t border-gray-700">
        <label htmlFor="new-deck" className="block text-sm font-medium text-gray-300 mb-2">Create New Deck</label>
        <div className="flex gap-2">
            <input
                id="new-deck"
                type="text"
                value={newDeckName}
                onChange={e => setNewDeckName(e.target.value)}
                placeholder="e.g., Advanced JavaScript"
                className="flex-grow bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition p-3"
            />
            <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition-transform transform hover:scale-105"
            >
                <PlusIcon className="h-5 w-5" />
                Create
            </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default DeckList;
