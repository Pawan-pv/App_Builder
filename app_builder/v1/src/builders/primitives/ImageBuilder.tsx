import React from 'react';
import type { Widget } from '../../types';


interface ImageBuilderProps {
    widget: Widget;
    isPreview?: boolean;
}

export function ImageBuilder({ widget }: ImageBuilderProps) {
    const props = widget.props;
    const style = props.style || {};

    // Default placeholder image
    const imageUrl = style.imageUrl || 'https://via.placeholder.com/150';

    const computedStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
    };

    return (
        <img
            src={imageUrl}
            alt="Widget"
            style={computedStyle}
            draggable={false}
        />
    );
}
