
import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { generateFlashcardContent } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';
import PlusIcon from './icons/PlusIcon';
import UploadIcon from './icons/UploadIcon';
import TrashIcon from './icons/TrashIcon';

interface FlashcardFormProps {
  onSave: (card: Omit<Flashcard, 'id' | 'isFavorite'>, originalId?: string) => void;
  onCancel: () => void;
  existingDecks: string[];
  initialData?: Partial<Flashcard>;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ onSave, onCancel, existingDecks, initialData }) => {
  const isEditMode = !!initialData?.id;

  const [deck, setDeck] = useState(initialData?.deck || 'Default');
  const [sideA, setSideA] = useState(initialData?.sideA || '');
  const [sideB, setSideB] = useState(initialData?.sideB || '');
  const [sideC, setSideC] = useState(initialData?.sideC || '');
  const [sideAImage, setSideAImage] = useState<string | null>(initialData?.sideAImage || null);
  const [sideBImage, setSideBImage] = useState<string | null>(initialData?.sideBImage || null);
  const [sideCImage, setSideCImage] = useState<string | null>(initialData?.sideCImage || null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const handleFile = (file: File | null, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
     if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
          setError('Image size should be less than 2MB.');
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
          setter(reader.result as string);
          setError('');
      };
      reader.onerror = () => {
          setError('Failed to read image file.');
      }
      reader.readAsDataURL(file);
    }
  }

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    handleFile(e.target.files?.[0] || null, setter);
    e.target.value = ''; // Allow re-uploading the same file
  };
  
  const handlePaste = (
    e: React.ClipboardEvent<HTMLDivElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const items = e.clipboardData.items;
    for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            handleFile(file, setter);
            e.preventDefault();
            return;
        }
    }
  }

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deck.trim()) {
        setError('Deck name is required.');
        return;
    }
    if (
      (!sideA.trim() && !sideAImage) ||
      (!sideB.trim() && !sideBImage) ||
      (!sideC.trim() && !sideCImage)
    ) {
      setError('All three sides must have either text or an image.');
      return;
    }
    onSave({ deck, sideA, sideAImage, sideB, sideBImage, sideC, sideCImage }, initialData?.id);

    if (!isEditMode) {
      // Reset fields for next card entry, keep the deck
      setSideA('');
      setSideB('');
      setSideC('');
      setSideAImage(null);
      setSideBImage(null);
      setSideCImage(null);
      setSuccessMessage('Card successfully added! Create another?');
      setError('');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };
  
  const handleGenerateSideC = async () => {
    if (!sideA.trim() || !sideB.trim()) {
      setError('Please fill out Side 1 and Side 2 to generate Side 3 text.');
      return;
    }
    setError('');
    setIsGenerating(true);
    try {
      const content = await generateFlashcardContent(sideA, sideB);
      setSideC(content);
    } catch (err)
      {
      setError('Failed to generate content.');
    } finally {
      setIsGenerating(false);
    }
  };

  const isApiKeySet = !!process.env.API_KEY;
  
  const ImageUploader: React.FC<{
    sideId: string;
    image: string | null;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
  }> = ({ sideId, image, onUpload, onRemove }) => (
    <div className="mt-2">
      {image ? (
        <div className="relative inline-block">
          <img src={image} alt={`Side ${sideId} preview`} className="max-h-32 rounded-lg border border-gray-600" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-500 text-white rounded-full p-1 transition-colors"
            aria-label={`Remove image for Side ${sideId}`}
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <label htmlFor={`${sideId}-upload`} className="cursor-pointer inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
            <UploadIcon className="h-4 w-4" />
            <span>Upload Image</span>
          </label>
          <input
            id={`${sideId}-upload`}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onUpload}
          />
        </>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 bg-gray-800 rounded-lg shadow-2xl">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-cyan-400 mb-6">{isEditMode ? 'Edit Tri-Card' : 'Create a New Tri-Card'}</h2>
      <form onSubmit={handleSaveCard} className="space-y-6">
        <div>
          <label htmlFor="deck" className="block text-sm font-medium text-gray-300 mb-2">Deck Name</label>
          <input
            id="deck"
            type="text"
            list="deck-suggestions"
            value={deck}
            onChange={(e) => setDeck(e.target.value)}
            placeholder="e.g., React Hooks"
            required
            disabled={isEditMode || (!!initialData?.deck)} // Disable if editing or creating from a deck view
            className="w-full bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition p-3 disabled:bg-gray-600 disabled:cursor-not-allowed"
          />
          <datalist id="deck-suggestions">
            {existingDecks.map(d => <option key={d} value={d} />)}
          </datalist>
        </div>

        <div onPaste={(e) => handlePaste(e, setSideAImage)}>
          <label htmlFor="sideA" className="block text-sm font-medium text-gray-300 mb-2">Side 1 (e.g., Term) - You can paste an image here!</label>
          <textarea
            id="sideA"
            value={sideA}
            onChange={(e) => setSideA(e.target.value)}
            placeholder="React"
            rows={2}
            className="w-full bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition p-3"
          />
          <ImageUploader sideId="A" image={sideAImage} onUpload={(e) => handleImageUpload(e, setSideAImage)} onRemove={() => setSideAImage(null)} />
        </div>
        <div onPaste={(e) => handlePaste(e, setSideBImage)}>
          <label htmlFor="sideB" className="block text-sm font-medium text-gray-300 mb-2">Side 2 (e.g., Definition)</label>
          <textarea
            id="sideB"
            value={sideB}
            onChange={(e) => setSideB(e.target.value)}
            placeholder="A JavaScript library for building user interfaces"
            rows={2}
            className="w-full bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition p-3"
          />
          <ImageUploader sideId="B" image={sideBImage} onUpload={(e) => handleImageUpload(e, setSideBImage)} onRemove={() => setSideBImage(null)} />
        </div>
        <div onPaste={(e) => handlePaste(e, setSideCImage)}>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="sideC" className="block text-sm font-medium text-gray-300">Side 3 (e.g., Example/Mnemonic)</label>
                <button
                    type="button"
                    onClick={handleGenerateSideC}
                    disabled={isGenerating || !isApiKeySet}
                    className="flex items-center gap-2 text-sm px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    title={!isApiKeySet ? "API Key not configured. AI features disabled." : "Generate with AI"}
                >
                    <SparklesIcon className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Generating...' : 'AI Generate'}
                </button>
            </div>
          <textarea
            id="sideC"
            value={sideC}
            onChange={(e) => setSideC(e.target.value)}
            placeholder="Example: const element = <h1>Hello, world!</h1>;"
            rows={2}
            className="w-full bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition p-3"
          />
           <ImageUploader sideId="C" image={sideCImage} onUpload={(e) => handleImageUpload(e, setSideCImage)} onRemove={() => setSideCImage(null)} />
        </div>

        {error && <p className="text-red-400 text-center">{error}</p>}
        {successMessage && <p className="text-green-400 text-center">{successMessage}</p>}
        
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-md transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-md transition-transform transform hover:scale-105"
          >
            <PlusIcon />
            {isEditMode ? 'Save Changes' : 'Add Card'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlashcardForm;
