export const WIDGETS = {
  Text: {
    defaultProps: { value: "Text", fontSize: 16 },
    props: ["value", "fontSize"],
  },
  Button: {
    defaultProps: { text: "Button" },
    props: ["text"],
  },
  Image: {
    defaultProps: { url: "", height: 200 },
    props: ["url", "height"],
  },
  Column: {
    children: true,
  },
};
