
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import FlashcardForm from './components/FlashcardCreator';
import FlashcardViewer from './components/FlashcardViewer';
import DeckList from './components/DeckList';
import DeckView from './components/DeckView';
import { Flashcard } from './types';
import PlusIcon from './components/icons/PlusIcon';
import FolderIcon from './components/icons/FolderIcon';
import StarIcon from './components/icons/StarIcon';

type View = 'deck-list' | 'deck-view' | 'create-card' | 'edit-card' | 'learn';
type CreationContext = 'global' | 'deck-view';

const App: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    try {
      const savedCards = localStorage.getItem('flashcards_v2');
      return savedCards ? JSON.parse(savedCards) : [];
    } catch (error) {
      console.error('Could not parse flashcards from localStorage', error);
      return [];
    }
  });

  const [deckNames, setDeckNames] = useState<string[]>(() => {
    try {
      const savedDecks = localStorage.getItem('deckNames_v2');
      const decks = savedDecks ? JSON.parse(savedDecks) : ['Default'];
      if (!decks.includes('Default')) {
        decks.push('Default');
      }
      return decks;
    } catch (error) {
      return ['Default'];
    }
  });
  
  const [view, setView] = useState<View>('deck-list');
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [cardToEdit, setCardToEdit] = useState<Flashcard | null>(null);
  const [cardToCreate, setCardToCreate] = useState<Partial<Flashcard> | null>(null);
  const [creationContext, setCreationContext] = useState<CreationContext>('global');

  useEffect(() => {
    try {
        localStorage.setItem('flashcards_v2', JSON.stringify(flashcards));
    } catch (error) {
        console.error('Could not save flashcards to localStorage', error);
    }
  }, [flashcards]);

  useEffect(() => {
    try {
      localStorage.setItem('deckNames_v2', JSON.stringify(deckNames));
    } catch (error) {
      console.error('Could not save deck names to localStorage', error);
    }
  }, [deckNames]);

  const decks = useMemo(() => {
    const deckMap = new Map<string, number>();
    flashcards.forEach(card => {
        deckMap.set(card.deck, (deckMap.get(card.deck) || 0) + 1);
    });
    deckNames.forEach(name => {
        if (!deckMap.has(name)) {
            deckMap.set(name, 0);
        }
    });
    return Array.from(deckMap.entries()).map(([name, cardCount]) => ({ name, cardCount })).sort((a,b) => a.name.localeCompare(b.name));
  }, [flashcards, deckNames]);

  const favoriteCards = useMemo(() => flashcards.filter(c => c.isFavorite), [flashcards]);

  const saveCard = (cardData: Omit<Flashcard, 'id' | 'isFavorite'>, originalId?: string) => {
    if (originalId) { // Editing existing card
      setFlashcards(prev => prev.map(c => c.id === originalId ? { ...c, ...cardData } : c));
    } else { // Creating new card
      const newCard: Flashcard = {
        ...cardData,
        id: new Date().toISOString() + Math.random().toString(),
        isFavorite: false,
      };
      setFlashcards(prev => [...prev, newCard]);
      if (!deckNames.includes(cardData.deck)) {
        setDeckNames(prev => [...prev, cardData.deck]);
      }
    }

    if (originalId || creationContext === 'global') {
        setView(selectedDeck ? 'deck-view' : 'deck-list');
        setCardToEdit(null);
        setCardToCreate(null);
    }
    // If creationContext is 'deck-view' and it's a new card, we don't change the view.
    // The form will handle its own state reset.
  };

  const deleteFlashcard = useCallback((cardId: string) => {
    setFlashcards(prev => prev.filter(c => c.id !== cardId));
  }, []);

  const toggleFavorite = useCallback((cardId: string) => {
    setFlashcards(prev => prev.map(c => 
        c.id === cardId ? { ...c, isFavorite: !c.isFavorite } : c
    ));
  }, []);

  const createDeck = (deckName: string) => {
    if (!deckNames.includes(deckName)) {
      setDeckNames(prev => [...prev, deckName]);
    }
  };

  const deleteDeck = (deckName: string) => {
    setDeckNames(prev => prev.filter(d => d !== deckName));
    setFlashcards(prev => prev.filter(c => c.deck !== deckName));
    if (selectedDeck === deckName) {
      setView('deck-list');
      setSelectedDeck(null);
    }
  };

  const handleSelectDeck = (deckName: string) => {
    setSelectedDeck(deckName);
    if (deckName === 'Favorites' || deckName === 'All Cards') {
        setView('learn');
    } else {
        setView('deck-view');
    }
  };
  
  const handleEditCard = (card: Flashcard) => {
    setCardToEdit(card);
    setView('edit-card');
  };

  const handleCreateCard = (deckName?: string) => {
    if (deckName) {
      setCardToCreate({ deck: deckName });
      setCreationContext('deck-view');
    } else {
      setCardToCreate({});
      setCreationContext('global');
    }
    setView('create-card');
  }

  const handleCancelForm = () => {
    setView(selectedDeck && creationContext === 'deck-view' ? 'deck-view' : 'deck-list');
    setCardToEdit(null);
    setCardToCreate(null);
  }

  const renderContent = () => {
    switch(view) {
        case 'deck-list':
            return <DeckList 
                decks={decks}
                favoriteCount={favoriteCards.length}
                totalCardCount={flashcards.length}
                onSelectDeck={handleSelectDeck}
                onDeleteDeck={deleteDeck}
                onCreateDeck={createDeck}
            />;
        case 'deck-view':
            const cardsInDeck = flashcards.filter(c => c.deck === selectedDeck);
            return <DeckView
                deckName={selectedDeck!}
                cards={cardsInDeck}
                onLearnDeck={() => setView('learn')}
                onCreateCard={() => handleCreateCard(selectedDeck!)}
                onEditCard={handleEditCard}
                onDeleteCard={deleteFlashcard}
                onToggleFavorite={toggleFavorite}
                onBack={() => { setView('deck-list'); setSelectedDeck(null); }}
            />
        case 'create-card':
            return <FlashcardForm 
                onSave={saveCard}
                onCancel={handleCancelForm}
                existingDecks={deckNames}
                initialData={cardToCreate || undefined}
            />;
        case 'edit-card':
            return <FlashcardForm
                onSave={saveCard}
                onCancel={handleCancelForm}
                existingDecks={deckNames}
                initialData={cardToEdit || undefined}
            />;
        case 'learn':
            const cardsToLearn = selectedDeck === 'Favorites' ? favoriteCards 
                : selectedDeck === 'All Cards' ? flashcards 
                : flashcards.filter(c => c.deck === selectedDeck);
            return <FlashcardViewer 
                cards={cardsToLearn}
                onToggleFavorite={toggleFavorite}
                onDeleteCard={deleteFlashcard}
                deckName={selectedDeck || ''}
                onBack={() => setView(selectedDeck === 'Favorites' || selectedDeck === 'All Cards' ? 'deck-list' : 'deck-view')}
            />;
        default:
            return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
              Tri-Card Genius
            </span>
          </h1>
          <p className="text-gray-400 mt-2">The Three-Sided Flashcard App for Deeper Learning</p>
        </header>

        <main>
          <div className="flex justify-center border-b border-gray-700 mb-8">
            <button
                onClick={() => { setView('deck-list'); setSelectedDeck(null); }}
                className={`flex items-center gap-2 px-4 py-2 text-sm md:text-base font-medium rounded-t-lg transition-colors ${
                  ['deck-list', 'deck-view'].includes(view)
                    ? 'bg-gray-800 text-cyan-400'
                    : 'bg-transparent text-gray-400 hover:bg-gray-800'
                }`}
            >
              <FolderIcon className="h-5 w-5" />
              Decks
            </button>
            <button
                onClick={() => handleCreateCard()}
                className={`flex items-center gap-2 px-4 py-2 text-sm md:text-base font-medium rounded-t-lg transition-colors ${
                  ['create-card', 'edit-card'].includes(view)
                    ? 'bg-gray-800 text-cyan-400'
                    : 'bg-transparent text-gray-400 hover:bg-gray-800'
                }`}
            >
              <PlusIcon className="h-5 w-5" />
              Create Card
            </button>
            <button
                onClick={() => { setSelectedDeck('Favorites'); setView('learn'); }}
                className={`flex items-center gap-2 px-4 py-2 text-sm md:text-base font-medium rounded-t-lg transition-colors ${
                  (view === 'learn' && selectedDeck === 'Favorites')
                    ? 'bg-gray-800 text-yellow-400'
                    : 'bg-transparent text-gray-400 hover:bg-gray-800'
                }`}
            >
              <StarIcon className="h-5 w-5" filled={view === 'learn' && selectedDeck === 'Favorites'} />
              Favorites ({favoriteCards.length})
            </button>
          </div>

          {renderContent()}
        </main>
        
        <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>Created with React, Tailwind CSS, and Gemini AI.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
