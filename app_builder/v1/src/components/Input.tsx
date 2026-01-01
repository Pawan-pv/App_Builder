type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input(props: Props) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 border rounded outline-none focus:ring"
    />
  );
}
