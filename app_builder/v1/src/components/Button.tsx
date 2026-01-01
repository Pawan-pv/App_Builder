type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
    >
      {children}
    </button>
  );
}
