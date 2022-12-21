type TextProps = {
    style?: React.CSSProperties;
    children: React.ReactNode;
    className?: string;
    height: number;

};

export default function CenteredText( { className, height, style, children }: TextProps ) {
    // height and lineHeight need to be the same to vertically align the text in the center
    return <div className={className} style={{...style, height: `${height}px`, lineHeight: `${height}px` }}>{children}</div>;
}