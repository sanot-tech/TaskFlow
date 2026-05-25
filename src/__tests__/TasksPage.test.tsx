import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

let mockTasks: any[] = [];
let mockTaskTitle = '';
const mockSetTasks = jest.fn();
const mockSetTaskTitle = jest.fn();

jest.mock('../hooks/useLocalStorage', () => ({
  useLocalStorage: (key: string, initialValue: any) => {
    if (key === 'todo_tasks') return [mockTasks, mockSetTasks];
    if (key === 'todo_title') return [mockTaskTitle, mockSetTaskTitle];
    if (key === 'todo_description') return ['', jest.fn()];
    if (key === 'todo_priority') return ['medium', jest.fn()];
    if (key === 'todo_priority_color') return ['bg-yellow-500', jest.fn()];
    if (key === 'todo_due_date') return [undefined, jest.fn()];
    if (key === 'todo_tags') return [[], jest.fn()];
    return [initialValue, jest.fn()];
  },
}));

jest.mock('../hooks/useUserProfile', () => ({
  useUserProfile: () => ({
    profile: { id: 'test', username: 'TestUser', theme: 'dark', createdAt: '', lastVisit: '', settings: { notifications: true, soundEnabled: true, selectedSound: 'bell' } },
    isLoading: false,
    updateProfile: jest.fn(),
    updateSettings: jest.fn(),
    resetProfile: jest.fn(),
  }),
}));

jest.mock('../utils/toast', () => ({
  showSuccess: jest.fn(),
  showError: jest.fn(),
}));

jest.mock('webfontloader', () => ({
  load: jest.fn(),
}));

jest.mock('../hooks/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

jest.mock('../components/ScrollNav', () => ({
  ScrollNav: () => <div data-testid="scroll-nav" />,
}));

jest.mock('../components/PremiumHeader', () => ({
  PremiumHeader: () => <div data-testid="premium-header" />,
}));

jest.mock('../components/AlarmControl', () => ({
  AlarmControl: () => <div data-testid="alarm-control" />,
}));

jest.mock('../components/TaskCard', () => ({
  TaskCard: ({ task, onToggleCompletion, onDelete }: any) => (
    <div data-testid={`task-card-${task.id}`}>
      <span>{task.title}</span>
      <button onClick={() => onToggleCompletion(task.id)}>toggle</button>
      <button onClick={() => onDelete(task.id)}>delete</button>
    </div>
  ),
}));

jest.mock('../components/ProfileComponentsWrapper', () => ({
  ProfileComponentsWrapper: ({ children }: any) => <>{children}</>,
}));

jest.mock('../components/AdaptiveCardTitle', () => ({
  AdaptiveCardTitle: ({ children }: any) => <>{children}</>,
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockTasks = [];
  mockTaskTitle = '';
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

const renderIndex = () =>
  render(
    <BrowserRouter>
      <div id="__next">
        <IndexPage />
      </div>
    </BrowserRouter>
  );

import IndexPage from '../pages/Index';

describe('TasksPage', () => {
  it('renders the page with header and controls', () => {
    renderIndex();
    expect(screen.getByTestId('scroll-nav')).toBeInTheDocument();
    expect(screen.getByTestId('premium-header')).toBeInTheDocument();
    expect(screen.getByTestId('alarm-control')).toBeInTheDocument();
  });

  it('renders task list when tasks exist', () => {
    mockTasks = [
      { id: '1', title: 'Test Task', description: '', completed: false, priority: 'medium', priorityColor: 'bg-yellow-500', tags: [], subtasks: [] },
      { id: '2', title: 'Done Task', description: '', completed: true, priority: 'low', priorityColor: 'bg-green-500', tags: [], subtasks: [] },
    ];

    renderIndex();

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Done Task')).toBeInTheDocument();
  });

  it('adds a new task', () => {
    mockTaskTitle = 'New Task Title';
    renderIndex();

    const addButton = screen.getByText('Create Task');
    fireEvent.click(addButton);

    expect(mockSetTasks).toHaveBeenCalled();
    expect(mockSetTaskTitle).toHaveBeenCalledWith('');
  });

  it('toggles task completion', () => {
    mockTasks = [
      { id: '1', title: 'Toggle Me', description: '', completed: false, priority: 'medium', priorityColor: 'bg-yellow-500', tags: [], subtasks: [] },
    ];

    renderIndex();
    const toggleButtons = screen.getAllByText('toggle');
    fireEvent.click(toggleButtons[0]);

    expect(mockSetTasks).toHaveBeenCalled();
  });

  it('deletes a task', () => {
    mockTasks = [
      { id: '1', title: 'Delete Me', description: '', completed: false, priority: 'medium', priorityColor: 'bg-yellow-500', tags: [], subtasks: [] },
    ];

    renderIndex();
    const deleteButtons = screen.getAllByText('delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockSetTasks).toHaveBeenCalled();
  });
});
