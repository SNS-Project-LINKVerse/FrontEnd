import React from 'react';
import Stories from 'react-insta-stories';

const StoryModal = ({ open, onClose, stories, startIndex }) => {
  if (!open) return null;

  return (
    <div className="story-modal-backdrop" onClick={onClose}>
      <div className="story-modal-content" onClick={e => e.stopPropagation()}>
        <Stories
          stories={stories}
          defaultInterval={4000}
          width={350}
          height={600}
          currentIndex={startIndex}
        />
        <button className="story-modal-close" onClick={onClose}>´Ý±â</button>
      </div>
    </div>
  );
};

export default StoryModal;
