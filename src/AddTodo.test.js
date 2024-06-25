import { render, screen, fireEvent, queryAllByAttribute } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  const dueDate1 = "06/30/2024";
  const dueDate2 = "06/25/2024";

  const taskName = "Work on CS Lab";

  // Create original task
  fireEvent.change(inputTask, { target: { value: taskName } });
  fireEvent.change(inputDate, { target: { value: dueDate1 } });
  fireEvent.click(element);

  // Create duplicate task
  fireEvent.change(inputTask, { target: { value: taskName } });
  fireEvent.change(inputDate, { target: { value: dueDate2 } });
  fireEvent.click(element);

  // Check if two of the same tasks exist
  const itemsWithSameId = queryAllByAttribute('data-testid', document.body, taskName);
  expect(itemsWithSameId.length).toBe(1);
});

test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  const dueDate = "06/30/2024";

  // Create task without name
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  // Check if the task exists by checking if the date is on screen
  const check = screen.queryByText(new RegExp(dueDate, "i"));
  expect(check).toBeNull();
});

test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const element = screen.getByRole('button', { name: /Add/i });
  const taskName = "Go do 1k pushups";

  // Create task without due date
  fireEvent.change(inputTask, { target: { value: taskName } });
  fireEvent.click(element);

  // Check if the task exists by checking if the name is on screen
  const check = screen.queryByText(taskName);
  expect(check).toBeNull();
});

test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  const taskName = "Go Work on Flutter Project"
  const dueDate = "06/30/2024";

  // Create task
  fireEvent.change(inputTask, { target: { value: taskName } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  // Check if task exists
  const check = screen.getByText(taskName);
  const checkDate = screen.getByText(new RegExp(dueDate, "i"));
  expect(check).toBeInTheDocument();
  expect(checkDate).toBeInTheDocument();

  const deleteButton = screen.getByRole('checkbox');

  // Delete task and check if it does not exist
  fireEvent.click(deleteButton);
  const checkAgain = screen.queryByText(taskName);
  expect(checkAgain).toBeNull();
});


test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  const taskName = "Prep Gyudon"
  const dueDate = "06/10/2024";

  // Create task
  fireEvent.change(inputTask, { target: { value: taskName } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  // Check if task exists
  const check = screen.getByText(taskName);
  const checkDate = screen.getByText(new RegExp(dueDate, "i"));
  expect(check).toBeInTheDocument();
  expect(checkDate).toBeInTheDocument();

  // Check to see if the color is not white (indicating past due)
  const historyCheck = screen.getByTestId(taskName).style.background;
  expect(historyCheck).not.toEqual('white');
});
