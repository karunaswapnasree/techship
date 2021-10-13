import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";


describe('App', () => {
  test('renders App component', () => {
    render(<App />);
  });
  test("DOM Should Have Loading", () => {
    render(<App />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

});



