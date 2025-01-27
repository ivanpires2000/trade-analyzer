import React from 'react';

const SocialShare = ({ content }) => {
    const shareOnSocialMedia = (platform) => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(content);
        let shareUrl = '';

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            default:
                return;
        }

        window.open(shareUrl, '_blank');
    };

    return (
        <div>
            <button onClick={() => shareOnSocialMedia('twitter')}>Compartilhar no Twitter</button>
            <button onClick={() => shareOnSocialMedia('facebook')}>Compartilhar no Facebook</button>
        </div>
    );
};

export default SocialShare; 