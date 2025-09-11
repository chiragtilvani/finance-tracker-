import React from 'react';
import EmojiPicker from 'emoji-picker-react';

const CustomEmojiPicker = ({ onSelect }) => {
  return (
    <div style={{ width: '100%' }}>
      <EmojiPicker 
        onEmojiClick={(emojiData) => onSelect(emojiData.emoji)}
        width="100%"
        height={350}
        theme="light"
        searchPlaceholder="Search emojis"
        skinTonesDisabled
        previewConfig={{ showPreview: false }}
        autoFocusSearch={false}
      />
    </div>
  );
};

export default CustomEmojiPicker;