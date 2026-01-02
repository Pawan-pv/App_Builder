import React from 'react';
import type { Widget } from '../../types';
import { resolveBinding } from '../../runTimeEngine/bindingResolver';
import { theme } from '../../theme';

interface TextBuilderProps {
    widget: Widget;
    isPreview?: boolean;
}

export function TextBuilder({ widget }: TextBuilderProps) {
    const props = widget.props;
    const style = props.style || {};
    const content = props.content || {};

    const text = resolveBinding(content.text as string) || 'Text';

    const computedStyle: React.CSSProperties = {
        color: style.color || theme.colors.text,
        fontSize: style.fontSize ? `${style.fontSize}px` : '14px',
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
        padding: '0px',
        width: '100%',
        fontFamily: 'inherit',
    };

    return (
        <div style={computedStyle} className="whitespace-pre-wrap">
            {text}
        </div>
    );
}
